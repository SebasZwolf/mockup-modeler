<script lang="ts" setup>
import { ref } from 'vue';

import { type t_colour } from '../../util/types';


const p = withDefaults(defineProps<{
	initial? : t_colour;
}>(), {
});

const value = ref<t_colour>(p.initial ?? 'transparent');

defineExpose({
	value
});

const e = defineEmits<{
	change : [t_colour]
}>();

const update = (c : t_colour ) => e('change', value.value = c);

</script>

<template>
	<div class="flex gap items-center">

		<div v-if="value != 'transparent'"  class="order-1 leading-none bg-cyan-800 border-2 border-l-0 pl-1 rounded-r -ml-1">
			<button type="button" @click="update('transparent')" 
				class="px-0.5 block hover:text-red-300" aria-label="borrar color">
				<svg width="12"  height="12"  viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
					<path d="M18 6l-12 12" />
					<path d="M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="relative color-picker w-fit h-fit self-center rounded-full overflow-hidden bg-[var(--color)] border-2" :style="`--color : ${value}`">
			<input type="color" @change="update(($event.target as HTMLInputElement).value as t_colour)"
			class="opacity-0 cursor-pointer aspect-square bg-white p-0 w-4 h-4 self-center"/>
		</div>
	</div>
</template>
