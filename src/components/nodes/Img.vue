<script lang="ts" setup>
import { to_basic, to_button, to_img } from '../../util/types';

const p = withDefaults(defineProps<to_img & {
	meta? : string,
}>(), {
	w : 48,
	h : 32,
});

</script>

<template>
	<img class="tnode_img object-cover"
		:src="`https://images.placeholders.dev/?width=${48}&height=${32}&text=Made%20with%20placeholders.dev`"

		:style="`height: ${p.h}px`"
		:width="p.w"
		:height="p.h"
		:alt="meta" />
</template>

<style>
.tnode_img {
}
</style>