<!--
Auto-generated by: https://github.com/threlte/threlte/tree/main/packages/gltf
Command: npx @threlte/gltf@3.0.1 ../../../../../static/models/mustache.glb
Author: depa_96 (https://sketchfab.com/depa_96)
License: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
Source: https://sketchfab.com/3d-models/mustache-free-model-bigote-3697959ccd3d464fb60e892b48ffff3f
Title: Mustache Free Model (Bigote)
-->

<script>
	import { T } from "@threlte/core";
	import { useGltf } from "@threlte/extras";
	import { degToRad } from "three/src/math/MathUtils.js";

	let { fallback, error, children, ref = $bindable(), ...props } = $props();

	const gltf = useGltf("/models/mustache.glb");
</script>

<T.Group bind:ref dispose={false} {...props}>
	{#await gltf}
		{@render fallback?.()}
	{:then gltf}
		<T.Mesh
			geometry={gltf.nodes.Object_2.geometry}
			material={gltf.materials["default"]}
			rotation={[degToRad(-90), 0, degToRad(75)]}
			scale={0.005}
			position.y={1.75}
		/>
	{:catch err}
		{@render error?.({ error: err })}
	{/await}

	{@render children?.({ ref })}
</T.Group>
