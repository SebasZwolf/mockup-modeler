<script lang="ts">
import { PropType, defineComponent, ref } from 'vue';
import { type t_branch, t_root } from './Tree.vue';

export default defineComponent({
	props : {
		tree : {
			type : Object as PropType<Exclude<t_branch, string> | t_root>,
			required : true,
		},
		path : {
			type : Number,
			required : true,
		}
	},
	emits : ['action'],
	setup(p, { emit }) {
		const collapse = ref(false);

		return {
			collapse,
			toggleCollapse : () => collapse.value = !collapse.value,

			addNode : (payload:unknown, elpath : number[] = [p.path]) => emit('action', 'add', elpath, payload),
			putNode : (payload:unknown, elpath : number[] = [p.path]) => emit('action', 'put', elpath, payload),
			delNode : (payload:unknown, elpath : number[] = []) => emit('action', 'del', elpath, payload),

			updStyle : () => emit('action', 'upd', [p.path]),
			
		}
	}
})

</script>

<template>
	<div class="branch-inspector">
		<div>
			<button @click="toggleCollapse" class="btn btn-toggle" style="order: 0">
				<span v-if="collapse">&#x2799;</span><span v-else>&#x2798;</span>
			</button>

			<span class="btn index" style="order: 0">{{ path }}</span> 

			<div class="control-action-btns" style="order: 1">
				<button @click="addNode('text')">text</button>
				<button @click="addNode({ t : 'vsep', c : [] })">vsep</button>
				<button @click="addNode({ t : 'hsep', c : [] })">hsep</button>
			</div>
			
			<template v-if="tree.t !== 'root'">
				<select
					style="order: 0"
					:value="tree.t" @change="e => putNode({ at : path, val : { t : (e.target as HTMLSelectElement).value!, c : tree.c, b : tree.b }}, [])">
					<option value="vsep">Separador vertical</option>
					<option value="hsep">Separador horizontal</option>
				</select>
				<button class="btn btn-stl" style="order: 0" @click="updStyle">&#x2699;</button>
				<button class="btn btn-del" style="order: 2" @click="delNode({ at : path })">&#xd7;</button>
			</template>
			<template v-else>
				<div style="flex: 1 0 auto; height: 2rem; padding: .5rem .5rem;">
					<span >Raíz</span>
				</div>
			</template>
		</div>

		<div v-show="!collapse" class="tree-branches">
			<template v-for="(e, i) of tree.c">
				<div v-if="(typeof e === 'string')" class="branch-text">
					
					<span class="btn index">{{ i }}</span> 
					<input type="text" :value="e" @change="e => putNode({ at : i, val : (e.target as HTMLInputElement).value! }, [path])"/>
					<button class="btn btn-del" @click="delNode({ at : i }, [path])">&#xd7;</button>

				</div>
				<TreeInspector v-else
					:tree="e"
					:path="i"
					@action="(type : string, spath : number[], v? : string) => $emit('action', type, [path, ...spath], v)"/>
			</template>
		</div>

	</div>


</template>

<style>
.btn-action {
	& {
		display: flex;
		padding: .25rem .5rem;
		line-height: 1;
		align-items: center;
		
		color: black;
		font-size: x-small;
		
		background-color: #fff8;
		border-radius: 4px;
	}

	&:has(+.btn-action) { border-top-right-radius: 0; border-bottom-right-radius: 0; }
	& + .btn-action { border-top-right-radius: 0; border-bottom-right-radius: 0; }
}
.branch-inspector {
	& {
		padding-left : .5rem;
	}

	& > :first-child {
		background-color: #288;
		display: flex;
		gap : .25rem;
		padding : .25rem .5rem;
		align-items: center;
		border : 1px solid white;
		border-radius: .5rem .5rem 0 0;
	}

	& > :last-child {		
		display: flex;
		flex-direction: column;
		gap : .5rem;

		border-left: 2px dashed #fff6;
		padding-top : .5rem;
	}
	
	.branch-text {
		& {
			background-color: #6aa;
			padding : .25rem .5rem;
			display: flex;
			gap : .25rem;
			align-items: center;
			border : 1px solid white;
		}
		&:last-child {
			border-radius: 0 0 .5rem .5rem;
		}
	}

	& select, & input {
		height: 2rem;
		padding: .25rem .5rem;
		flex : 1 0 auto;
	}

	& .btn {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		border: none;

		aspect-ratio: 1;
		width: 1.5rem;
		border-radius: 50%;
	}

	& .index {
		font-size: x-small;
		cursor: auto;
		background-color: #334;
	}
	& .btn-toggle { background-color: #334;	}
	& .btn-del { background-color: #a33;	}
	.btn-stl { background-color: #323; }
	& .control-action-btns {
		& {
			display: flex;
		}

		& > button {
			background-color: #334;
			padding : .25rem .5rem;
		}
	}
}
</style>