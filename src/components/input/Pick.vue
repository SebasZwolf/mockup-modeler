<script lang="ts" setup>
import { computed, readonly, ref, shallowRef, watchEffect } from 'vue';

const p = withDefaults(defineProps<{
	initial? : string;
	options : readonly [unknown, ...unknown[]];
	name : string;
}>(), {
});

const value = ref(p.initial ?? p.options[0]);

defineExpose({
	value
});

const e = defineEmits<{
	change : [string]
}>();

const handle = computed({
	get : () => value.value,
	set : v => e('change', value.value = v as string),
});

</script>

<template>
	<ul class="option-selector group text-xs gap-[1px] bg-current border border-current rounded overflow-clip grid grid-flow-col" style="grid-auto-columns: 1fr;">
		<li v-for="item in options" class="block">
			<label class="cursor-pointer w-full text-center px-1.5 pt-0.5 pb-1 bg-cyan-800 block
				has-[input:checked]:bg-violet-300 has-[input:checked]:text-black">
				<input type="radio" hidden v-model="handle" :name="name" :value="item"/>
				{{ item }}
			</label>
		</li>
	</ul>
</template>