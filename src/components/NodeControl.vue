<script lang="ts" setup>
import { onMounted, onRenderTriggered, onUpdated, readonly } from 'vue';
import { custom_tree_item_adv } from '../util/types';

const p = defineProps<{
	children : readonly unknown[];
	data : custom_tree_item_adv;
	depth : number,
}>()

const emit = defineEmits<{
	selection : [number];

	add : [HTMLElement];
	del : [HTMLElement];
	move : [number]
}>();

onMounted(() => console.log('mounted! control', p.data.key));
onUpdated(() => console.log('updated! control', p.data.key));
onRenderTriggered(e => {
	console.log('trigger! control', p.data.key);
	debugger
});

</script>

<template>
	<div
		class="label group/label bg-cyan-600 px-1 border border-white flex gap-x-1 items-center rounded-t-md last:rounded-b-md">

		<label class="cursor-pointer">
			<input type="radio" hidden name="skere" @click="emit('selection', p.data.key)" />
			<svg width="16" height="16" viewBox="0 0 24 24">
				<template v-if="p.children?.length">
					<use class="collapse-hide" href="#icon-caret-r" />
					<use class="collapse-show" href="#icon-caret-d" />
				</template>
				<template v-else>
					<use class="collapse-hide" href="#icon-circle" />
					<use class="collapse-show" href="#icon-dot" />
				</template>
			</svg>
		</label>

		<code title="ID" class="bg-orange-300 text-black px-2 py-0.5 leading-none text-[11px] self-center rounded">
			ID: {{ p.data.key }}
		</code>

		<code title="Elemento" class="bg-violet-300 text-black px-2 py-0.5 leading-none text-[11px] self-center rounded">
			{{ p.data.type }}
		</code>

		<hr class="ml-auto" />

		<div v-if="p.depth"
			class="hidden group-hover/label:flex flex-col justify-center gap-0.5 overflow-y-visible w-min h-0 self-center ">
			<button
				class="bg-cyan-600 border hover:bg-cyan-700" @click="emit('move', -1)">
				<svg width="16" height="16" viewBox="0 0 24 24">
					<use href="#icon-caret-u" />
				</svg>
			</button>
			<button
				class="bg-cyan-600 border hover:bg-cyan-700"  @click="emit('move', 1)">
				<svg width="16" height="16" viewBox="0 0 24 24">
					<use href="#icon-caret-d" />
				</svg>
			</button>
		</div>

		<button class="text-white hover:text-lime-300 py-1" @click="emit('add', $event.target as HTMLElement)">
			<svg width="16" height="16" viewBox="0 0 24 24">
				<use href="#icon-plus" />
			</svg>
		</button>

		<button v-if="p.depth" class="text-white hover:text-red-300 py-1" @click="emit('del', $event.target as HTMLElement)">
			<svg width="16" height="16" viewBox="0 0 24 24">
				<use href="#icon-trash" />
			</svg>
		</button>
	</div>
	<!-- <div v-if="p.haschildren" class="collapse-show pl-2 pt-2 rounded-es-md">
		<slot></slot>
	</div> -->
</template>