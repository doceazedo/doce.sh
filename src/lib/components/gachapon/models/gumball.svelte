<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@3.0.1 static/models/gumball.glb
-->

<script lang="ts">
	import { T } from "@threlte/core";
	import { useCursor, useGltf } from "@threlte/extras";
	import { interactivity } from "@threlte/extras";
	import { GAME_STATE } from "../stores";
	import type { ComponentProps } from "svelte";
	import type { RigidBody } from "@dimforge/rapier3d-compat";

	let {
		ref = $bindable(),
		oncreate,
		coinMeshRotation = 0,
		...props
	}: ComponentProps<typeof T.Group> & {
		oncreate: (ref: RigidBody) => void | (() => void);
		coinMeshRotation?: number;
	} = $props();

	const gltf = useGltf("/models/gumball.glb");

	const { onPointerEnter, onPointerLeave } = useCursor();

	interactivity();
</script>

<T.Group
	bind:ref
	dispose={false}
	onpointerenter={$GAME_STATE === "idle" ? onPointerEnter : undefined}
	onpointerleave={onPointerLeave}
	{...props}
>
	{#await gltf then gltf}
		{#await import('@threlte/rapier') then rapier}
			<rapier.RigidBody type="fixed" {oncreate}>
				<rapier.AutoColliders shape="trimesh">
					<T.Mesh geometry={gltf.nodes.Globe.geometry}>
						<T.MeshPhysicalMaterial
							transparent={true}
							transmission={1}
							roughness={0.05}
							thickness={1.2}
							ior={0.9}
							clearcoat={1}
							clearcoatRoughness={0.02}
							color="#ffffff"
							envMapIntensity={0.9}
							opacity={0.2}
							reflectivity={0.1}
						/>
					</T.Mesh>
				</rapier.AutoColliders>
			</rapier.RigidBody>
		{/await}
		<T.Group position={[0, -1, 0]} scale={0.7}>
			<T.Mesh
				geometry={gltf.nodes.Circle002.geometry}
				material={gltf.materials.Metal}
			/>
			<T.Mesh geometry={gltf.nodes.Circle002_1.geometry}>
				<T.MeshStandardMaterial
					color="#d32f2f"
					roughness={0.35}
					metalness={0.05}
					clearcoat={0.8}
					clearcoatRoughness={0.1}
				/>
			</T.Mesh>
		</T.Group>
		<T.Mesh
			geometry={gltf.nodes.Hopper.geometry}
			position={[0, -0.94, 0]}
			scale={[0.65, 2.47, 0.65]}
		>
			<T.MeshStandardMaterial
				color="#d32f2f"
				roughness={0.35}
				metalness={0.05}
				clearcoat={0.8}
				clearcoatRoughness={0.1}
			/>
		</T.Mesh>
		<T.Mesh
			geometry={gltf.nodes.Base.geometry}
			position={[0, -2.04, 0]}
			scale={[0.92, 2.64, 0.92]}
		>
			<T.MeshStandardMaterial
				color="#d32f2f"
				roughness={0.35}
				metalness={0.05}
				clearcoat={0.8}
				clearcoatRoughness={0.1}
			/>
		</T.Mesh>
		<T.Mesh
			geometry={gltf.nodes.TopCap.geometry}
			material={gltf.materials.Body}
			position={[0, 0.96, 0]}
			scale={[0.36, 0.21, 0.36]}
		>
			<T.MeshStandardMaterial
				color="#d32f2f"
				roughness={0.35}
				metalness={0.05}
				clearcoat={0.8}
				clearcoatRoughness={0.1}
			/>
		</T.Mesh>
		<T.Mesh
			geometry={gltf.nodes.CoinMesh.geometry}
			material={gltf.materials.Metal}
			position={[-0.02, -1.27, 0.74]}
			rotation.z={coinMeshRotation}
		/>
		<T.Mesh
			geometry={gltf.nodes.Billboard.geometry}
			material={gltf.materials.Metal}
			position={[0, -1.72, 0.84]}
			rotation={[-0.26, 0, 0]}
			scale={[0.27, 0.3, 0.3]}
		/>
		<T.Mesh
			geometry={gltf.nodes.Plane.geometry}
			material={gltf.materials.Black}
			position={[-0.02, -1.73, 0.64]}
			rotation={[1.31, 0, 0]}
		/>
	{/await}
</T.Group>
