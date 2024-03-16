<script lang="ts" setup>
import { ref } from 'vue';

const p = withDefaults(defineProps<{
	length? : number;
	initial? : number[];
}>(), {
	length : 4,
});

const value = ref<(number | null)[]>(Object.assign(Array(4).fill(null), [0], p.initial));

defineExpose({
	value
});

const e = defineEmits<{
	change : [number[]];
}>();

const set = (i : number, v : string) => {
	if(v === '')
		value.value = Object.assign(Array(p.length).fill(null), [0], value.value.slice(0, i));
	else 
		value.value[i] = Number(v);
	
	e('change', value.value.filter(e => e !== null) as number[]);
}

</script>

<template>
	<div class="numbers flex gap-x-1 w-fit"
		role="group">

		<input v-for="(e, i) in value" :value="e" type="text" inputmode="numeric" required placeholder=""
			class="rounded text-sm leading-none text-right border w-8 bg-cyan-800 tabular-nums font-mono px-1 placeholder-shown:border-gray-400" 
			@change="set(i, ($event.target as HTMLInputElement).value)"
			/>
	</div>
</template>
