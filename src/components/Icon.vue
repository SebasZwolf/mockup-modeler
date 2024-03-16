<script setup lang="ts">
import { computed } from 'vue';
import { type t_icon } from '../util/types';

	const { w = 16, h = w, icon } = defineProps<{
		w? : number;
		h? : number;
		icon : t_icon;
	}>();
	
	const href = computed(() => `#icon-${icon}`)

</script>

<template>
	<svg :width="w" :height="h" viewBox="0 0 24 24">
		<use :href/>
	</svg>
</template>