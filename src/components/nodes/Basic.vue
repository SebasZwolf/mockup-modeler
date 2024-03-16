<script lang="ts" setup>
import { h } from 'vue';
import { to_basic } from '../../util/types';

const p = withDefaults(defineProps<Partial<to_basic> & {
	meta? : string,
}>(), {
	bg : 'transparent',
	flow : 'column',
	gap : 0,
	meta : 'empty',
	justify : 'inicio',
	pad : () => [1],
});

const justify = {
	'start' : 'flex-start',
	'center' : 'flex-end',
	'end' : 'center',
	'spaced' : 'space-between',
} as Record<string, string>;

</script>

<template>
	<div 
		class="tnode_basic flex"
		:style="`
			justify-content: ${ justify[p.justify] };
			flex-direction: ${p.flow};
			padding :${ p.pad.map(e => `${e! * 0.125}rem`).join(' ') };
			gap: ${ p.gap * 0.125 }rem;
			background-color: ${p.bg};`">
		<slot>{{ meta }}</slot>
	</div>
</template>

<style>
.tnode_basic {
	border: 1px solid white;
}
</style>