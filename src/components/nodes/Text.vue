<script lang="ts" setup>
import { to_text } from '../../util/types';

const p = withDefaults(defineProps<to_text & {
	meta? : string,
}>(), {
	meta : 'lorem ipsum',

	color : '#ffffff',
	fsize : 11,
});

</script>

<template>
	<p class="tnode_text" :class="[p.style]" 
		:style="`
			color: ${p.color};
			font-size: ${p.fsize}px;
			text-align : ${p.alignment};

			font-weight : ${ p.B ? 'bold' : 'normal' };
			font-style: ${ p.I ? 'italic' : 'normal'};
			text-decoration: ${ p.U ? 'underline' : 'none' };
		`" v-text="p.meta"></p>
</template>

<style>
p {
	font-weight: normal;
	text-decoration: underline;
}
</style>