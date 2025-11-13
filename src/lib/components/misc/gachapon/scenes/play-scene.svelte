<script lang="ts">
	import { T, useTask } from "@threlte/core";
	import Gumball from "../models/gumball.svelte";
	import { degToRad } from "three/src/math/MathUtils.js";
	import { Vector3 } from "three";
	import Capsule from "../models/capsule.svelte";
	import { browser } from "$app/environment";
	import type { RigidBody } from "@dimforge/rapier3d-compat";
	import { Tween } from "svelte/motion";
	import { bounceOut, cubicOut, elasticOut, expoOut } from "svelte/easing";
	import { shuffleArray, sleep } from "$lib/utils";
	import { onMount, tick } from "svelte";
	import {
		GAME_DATA,
		GAME_STATE,
		IS_GUMBALL_LOADED,
		LAST_PRIZE_ID,
		PRIZE_ITEM,
	} from "../stores";
	import { CAPSULE_PALETTE, ITEMS, RARITIES } from "../constants";
	import Prize from "./prize.svelte";
	import World from "./world.svelte";
	import { getRandomPrize, giveItem } from "../game";
	import type { RarityId, Vector3 as Vec3Array } from "../types";
	import { playAudio } from "$lib/audio";

	const DISPENSE_COST = 100;

	const PHYSICS_CONFIG = {
		gravityEnabled: [0, -9.81, 0] as Vec3Array,
		gravityDisabled: [0, 0, 0] as Vec3Array,
		capsuleRestitution: 0.7,
		shakeStrength: 0.2,
		shakeFrequency: 8,
	} as const;

	const SPAWN_CONFIG = {
		machineCenter: [-0.05, 2.4, 0.05] as Vec3Array,
		capsulesMultiplier: 2,
		capsuleShape: { height: 0.1, radius: 0.15 } as const,
	} as const;

	const MACHINE_CENTER = new Vector3(
		SPAWN_CONFIG.machineCenter[0],
		SPAWN_CONFIG.machineCenter[1],
		SPAWN_CONFIG.machineCenter[2],
	);

	const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

	const ANIMATION_TIMING = {
		coinMechSpn: 1500,
		gravityDelay: 1500,
		capsuleDrop: 2000,
		scaleTransition: 800,
		prizeReveal: 1500,
		shakeCycle: 950,
	} as const;

	const INITIAL_TRANSFORMS = {
		capsule: {
			position: [0.4, 0.7, 0] as Vec3Array,
			scale: [1, 1, 1] as Vec3Array,
		},
		capsuleCap: {
			up: [0, 0, 0] as Vec3Array,
			down: [0, 0.2, 0] as Vec3Array,
		},
		gumball: {
			position: [0, 2.5, 0] as Vec3Array,
			scale: [1, 1, 1] as Vec3Array,
		},
		prize: {
			scale: 0,
			rotation: 0,
		},
		coin: {
			rotation: 0,
		},
	} as const;

	const capsuleTweener = {
		position: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.capsule.position], {
			easing: bounceOut,
			duration: 1600,
		}),
		scale: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.capsule.scale], {
			easing: cubicOut,
			duration: ANIMATION_TIMING.scaleTransition,
		}),
	};

	const capsuleCapTweener = {
		up: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.capsuleCap.up], {
			easing: expoOut,
			duration: 600,
		}),
		down: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.capsuleCap.down], {
			easing: expoOut,
			duration: 600,
		}),
	};

	const gumballTweener = {
		position: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.gumball.position], {
			easing: elasticOut,
			duration: ANIMATION_TIMING.scaleTransition,
		}),
		scale: new Tween<Vec3Array>([...INITIAL_TRANSFORMS.gumball.scale], {
			easing: cubicOut,
			duration: 300,
		}),
	};

	const prizeTweener = {
		scale: new Tween<number>(INITIAL_TRANSFORMS.prize.scale, {
			easing: cubicOut,
			duration: ANIMATION_TIMING.scaleTransition,
		}),
		rotation: new Tween<number>(INITIAL_TRANSFORMS.prize.rotation, {
			easing: cubicOut,
			duration: 1600,
		}),
	};

	const coinMechTweener = new Tween<number>(INITIAL_TRANSFORMS.coin.rotation, {
		easing: elasticOut,
		duration: 5000,
	});

	let capsuleRigidBodies = $state<RigidBody[]>([]);
	let worldGravity = $state<Vec3Array>([...PHYSICS_CONFIG.gravityEnabled]);
	let isShaking = $state(false);
	let selectedCapsuleColor = $state(CAPSULE_PALETTE[0]);

	const calculateCapsulePosition = (
		idx: number,
		totalCapsules: number,
	): Vec3Array => {
		if (idx + 1 === totalCapsules) {
			return [...SPAWN_CONFIG.machineCenter];
		}

		const COILS = 5;
		const RADIUS = 0.5;

		const thetaMax = COILS * 2 * Math.PI;
		const normalIdx = idx / totalCapsules;
		const theta = normalIdx * thetaMax;
		const awayStep = RADIUS / thetaMax;
		const away = awayStep * theta;

		const x = MACHINE_CENTER.x + Math.cos(theta) * away;
		const z = MACHINE_CENTER.z + Math.sin(theta) * away;
		return [x, MACHINE_CENTER.y + 0.6 - normalIdx, z];
	};

	const resetAllAnimations = () => {
		capsuleTweener.position.set([...INITIAL_TRANSFORMS.capsule.position], {
			duration: 0,
		});
		capsuleTweener.scale.set([...INITIAL_TRANSFORMS.capsule.scale], {
			duration: 0,
		});

		capsuleCapTweener.up.set([...INITIAL_TRANSFORMS.capsuleCap.up], {
			duration: 0,
		});
		capsuleCapTweener.down.set([...INITIAL_TRANSFORMS.capsuleCap.down], {
			duration: 0,
		});

		gumballTweener.position.set([...INITIAL_TRANSFORMS.gumball.position], {
			duration: 0,
		});
		gumballTweener.scale.target = [...INITIAL_TRANSFORMS.gumball.scale];

		coinMechTweener.set(INITIAL_TRANSFORMS.coin.rotation, { duration: 0 });

		prizeTweener.scale.target = INITIAL_TRANSFORMS.prize.scale;
		prizeTweener.rotation.target = INITIAL_TRANSFORMS.prize.rotation;
	};

	const togglePhysics = (enabled: boolean) => {
		worldGravity = enabled
			? [...PHYSICS_CONFIG.gravityEnabled]
			: [...PHYSICS_CONFIG.gravityDisabled];

		capsuleRigidBodies.forEach((body) => {
			body
				.collider(0)
				.setRestitution(enabled ? 0 : PHYSICS_CONFIG.capsuleRestitution);
		});
	};

	const repositionCapsules = () => {
		const totalCapsules =
			CAPSULE_PALETTE.length * SPAWN_CONFIG.capsulesMultiplier;

		capsuleRigidBodies.forEach((body, index) => {
			const position = calculateCapsulePosition(index, totalCapsules);
			body.setRotation({ x: 0, y: 0, z: 0, w: 0 }, true);
			body.setTranslation(
				{ x: position[0], y: position[1], z: position[2] },
				true,
			);
		});
	};

	const initializeCoinSpinAndShake = () => {
		coinMechTweener.target = coinMechTweener.current - degToRad(360 * 2);
		gumballTweener.position.target = [0, 2.5, 0];
		selectedCapsuleColor =
			CAPSULE_PALETTE[Math.floor(Math.random() * CAPSULE_PALETTE.length)];
		togglePhysics(false);
		isShaking = true;
	};

	const enableGravityAndStopShaking = () => {
		togglePhysics(true);
		isShaking = false;
	};

	const emergeCapsuleFromMachine = () => {
		capsuleTweener.position.target = [0.9, 0.7, 0];
	};

	const scaleCapsuleAndMoveToViewport = () => {
		capsuleTweener.scale.target = [5, 5, 5];
		capsuleTweener.position.set([1.1, 2.15, 1.1], {
			easing: cubicOut,
			duration: ANIMATION_TIMING.scaleTransition,
		});
	};

	const hideGumballsAndRepositionCapsules = () => {
		gumballTweener.scale.target = [0.001, 0.001, 0.001];
		repositionCapsules();
	};

	const performCapsuleShakeLeft = async () => {
		capsuleTweener.position.set([0.9, 2.15, 1.1], { duration: 0 });
		await tick();
		capsuleTweener.position.set([1.1, 2.15, 1.1], {
			easing: elasticOut,
			duration: 600,
		});
	};

	const performCapsuleShakeForward = async () => {
		capsuleTweener.position.set([1.1, 2.15, 0.9], { duration: 0 });
		await tick();
		capsuleTweener.position.set([1.1, 2.15, 1.1], {
			easing: elasticOut,
			duration: 600,
		});
	};

	const revealPrizeFromCapsule = () => {
		$GAME_STATE = "prize";
		capsuleCapTweener.up.target = [0, capsuleCapTweener.up.current[1] + 1.5, 0];
		capsuleCapTweener.down.target = [
			0,
			capsuleCapTweener.down.current[1] - 1.5,
			0,
		];
		prizeTweener.scale.target = 1;
		prizeTweener.rotation.target = degToRad(360 * 2);
		if (!$PRIZE_ITEM) return;
		giveItem($PRIZE_ITEM);
	};

	const dispenseAnimationSequence = async () => {
		playAudio("gumball-dispense");
		resetAllAnimations();
		await sleep(100);

		initializeCoinSpinAndShake();
		await sleep(ANIMATION_TIMING.coinMechSpn);

		enableGravityAndStopShaking();
		await sleep(ANIMATION_TIMING.gravityDelay);

		emergeCapsuleFromMachine();
		await sleep(ANIMATION_TIMING.capsuleDrop);

		scaleCapsuleAndMoveToViewport();
		await sleep(50);

		hideGumballsAndRepositionCapsules();
		await sleep(ANIMATION_TIMING.shakeCycle);

		await performCapsuleShakeLeft();
		await sleep(ANIMATION_TIMING.prizeReveal);

		await performCapsuleShakeForward();
		await sleep(ANIMATION_TIMING.prizeReveal);
	};

	export const dispense = async () => {
		if ($GAME_DATA.balance < DISPENSE_COST || $GAME_STATE !== "idle") return;

		$GAME_DATA.balance -= DISPENSE_COST;
		$GAME_STATE = "drawing";
		$PRIZE_ITEM = getRandomPrize();
		$LAST_PRIZE_ID = $PRIZE_ITEM.id;

		await dispenseAnimationSequence();

		revealPrizeFromCapsule();
	};

	useTask((delta: number) => {
		capsuleRigidBodies.forEach((body) => {
			let distanceFromCenter = MACHINE_CENTER.distanceTo(body.translation());
			if (distanceFromCenter > (isShaking ? 1.1 : 1.5)) {
				body.setTranslation(MACHINE_CENTER, false);
			}
		});

		if (!isShaking) return;

		const shakeIntensity =
			Math.sin(delta * PHYSICS_CONFIG.shakeFrequency) *
			PHYSICS_CONFIG.shakeStrength;

		capsuleRigidBodies.forEach((body) => {
			const impulse = {
				x: (Math.random() - 0.5) * shakeIntensity,
				y: (Math.random() - 0.5) * shakeIntensity,
				z: (Math.random() - 0.5) * shakeIntensity,
			};
			body.applyImpulse(impulse, true);
		});
	});

	onMount(() => {
		$IS_GUMBALL_LOADED = false;
	});

	GAME_STATE.subscribe((state) => {
		if (state === "idle") {
			resetAllAnimations();
		}
	});
</script>

<World>
	{#if browser}
		{#await import('@threlte/rapier') then rapier}
			<rapier.World gravity={worldGravity}>
				{#if $PRIZE_ITEM}
					<Prize
						item={$PRIZE_ITEM}
						scale={prizeTweener.scale.current}
						rotationY={prizeTweener.rotation.current}
					/>
				{/if}

				<Gumball
					scale={gumballTweener.scale.current}
					position={gumballTweener.position.current}
					coinMeshRotation={coinMechTweener.current}
					rotation.y={degToRad(90)}
					oncreate={() => {
						$IS_GUMBALL_LOADED = true;
					}}
					onclick={dispense}
				/>

				{#if $IS_GUMBALL_LOADED}
					{#each Array(2)
						.fill(shuffleArray(CAPSULE_PALETTE))
						.flat() as color, index}
						<T.Group
							position={calculateCapsulePosition(
								index,
								CAPSULE_PALETTE.length * SPAWN_CONFIG.capsulesMultiplier,
							)}
						>
							<rapier.RigidBody bind:rigidBody={capsuleRigidBodies[index]}>
								<rapier.Collider
									shape="capsule"
									args={[
										SPAWN_CONFIG.capsuleShape.height,
										SPAWN_CONFIG.capsuleShape.radius,
									]}
								>
									<Capsule
										scale={gumballTweener.scale.current}
										position.y={-0.1}
										rotation={[Math.random() * 0.5, 0, Math.random() * -0.5]}
										{color}
									/>
								</rapier.Collider>
							</rapier.RigidBody>
						</T.Group>
					{/each}

					<Capsule
						position={capsuleTweener.position.current}
						positionUp={capsuleCapTweener.up.current}
						positionDown={capsuleCapTweener.down.current}
						scale={capsuleTweener.scale.current}
						color={selectedCapsuleColor}
					/>
				{/if}
			</rapier.World>
		{/await}
	{/if}
</World>
