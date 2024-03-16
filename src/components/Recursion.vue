<script setup lang="ts">
import type { raw_tree_branch } from '../util/types';
import { defineAsyncComponent, type DefineComponent, ComputedRef, computed, h, onBeforeUpdate, onMounted, onRenderTriggered, onUpdated, reactive, ref, shallowRef, triggerRef, unref, useAttrs, watch, watchEffect, withMemo } from 'vue';

// const Recursive = defineAsyncComponent<DefineComponent<Props>>(() => import('./Recursion.vue') as any);

import Recursive from './Recursion.vue';

export type recursed<T = any> = {
	data : T,
	depth : number,
	child : number,
	component? : unknown,
	children : Readonly<raw_tree_branch<T>[]>,
	chain : number[],

	components : any,
};

const s = defineSlots<{
	default(p : recursed) : any
}>();

const p = withDefaults(defineProps<{
	data : raw_tree_branch,

	depth? : number,
	child? : number,
	chain? : number[] | ComputedRef<number[]>,
}>(), {
	child : 0,
	depth : 0,
	chain : () => [],
});

defineExpose({
	key : p.data[0] && typeof p.data[0] === 'object' && 'key' in p.data[0] ? p.data[0].key as string | number : p.child,
	// find,
	// child_nodes,
});

type t_self = InstanceType<typeof Recursive>;
// const child_nodes : Array<unknown | null> = [];

const kids = computed(() => p.data[1] ?? []); 
const chains = computed(() => {
	const c = unref(p.chain);
	return kids.value.map((_, i) => [...c, i]);
});

const component = () => kids.value.map((e, i) => {
	const key : number = e[0] && typeof e[0] === 'object' && 'key' in e[0] ? e[0].key as number : i;

	return h(Recursive, { 
		key,
		// ref : el => child_nodes[i] = el,

		depth : p.depth + 1,
		data : e,
		child : i,
		chain : chains.value[i],
	}, {
		default : s.default
	})
});

const components = computed(() => kids.value.map((e, i) => {
	const key : number = e[0] && typeof e[0] === 'object' && 'key' in e[0] ? e[0].key as number : i;

	return h(Recursive, { 
		key : key,
		// ref : el => child_nodes[i] = el,

		data : e,
		child : i,
		depth : p.depth + 1,
		chain : chains.value[i],
	}, s)
}));

</script>

<template>
	<slot v-bind="{ data : p.data[0], children : unref(kids), depth, child, chain : unref(chain), component, components }"></slot>
</template>
