<script lang="ts" setup>
import { to_basic, to_button } from '../../util/types';

const { meta = 'button', disabled } = defineProps<to_button & {
	meta? : string,
}>();

</script>

<template>
	<button class="tnode_button" :disabled="disabled" >
		<slot>{{ meta }}</slot>
	</button>
</template>

<style>
.tnode_button {
	& {
		color: black; 
		text-align: center;
		background-color: #ccc;
		line-height: 1.2;
		padding : 0 .5rem;
		
		border-radius: .125rem;
		
		align-self: center;
	}
	&:hover {
		background-color: #eee;
	}
	&:active {
		background-color: #aaa;
	}
}	
</style>