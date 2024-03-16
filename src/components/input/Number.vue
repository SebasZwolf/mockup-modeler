<script lang="ts" setup>
import { ref } from 'vue';

const p = withDefaults(defineProps<{
	initial? : number;
	vmax? : number;
	vmin? : number;
}>(), {
	vmax : Infinity,
	vmin : -Infinity,
});

const value = ref<number>(p.initial ?? 0);

defineExpose({
	value
});

const e = defineEmits<{
	change : [number]
}>();

const sum = (v : number) => e('change', value.value = Math.max(Math.min(value.value + v, p.vmax), p.vmin));

</script>

<template>
	<div class="text-sm overflow-clip border w-fit rounded flex gap-x-[1px] leading-none bg-current border-current tabular-nums font-mono font-medium"
		role="group">
		<button @click="sum(-1)" type="button" class="px-2 py-0.5 bg-cyan-800 hover:bg-cyan-900 focus:ring-blue-500 focus:text-white">
			-</button>
		<slot>
			<output class="px-2 py-0.5 bg-cyan-700 " :value="value"></output>
		</slot>
		<button @click="sum(1)" type="button" class="px-2 py-0.5 bg-cyan-800 hover:bg-cyan-900 focus:ring-blue-500 focus:text-white">
			+</button>
	</div>
</template>