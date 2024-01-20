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
			movNode : (payload:unknown, elpath : number[] = []) => emit('action', 'mov', elpath, payload),

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

			<div class="control-action-btns" style="order: 1">
				<button @click="addNode('text')">text</button>
				<button @click="addNode({ t : 'vsep', c : [] })">vsep</button>
				<button @click="addNode({ t : 'hsep', c : [] })">hsep</button>
			</div>
			
			<template v-if="tree.t !== 'root'">
				<span class="btn index" style="order: -1">{{ path }}</span> 
				<select
					style="order: 0"
					:value="tree.t" @change="e => putNode({ at : path, val : { t : (e.target as HTMLSelectElement).value!, c : tree.c, b : tree.b, i : tree.i }}, [])">
					<option value="vsep">Separador vertical</option>
					<option value="hsep">Separador horizontal</option>
				</select>
				<button class="btn btn-del" style="order: 2" @click="delNode({ at : path })">&#xd7;</button>

				<div class="position-action-btns" style="order: 1">
					<button @click="movNode({ at : path, dir : false })">&#x21e1;</button>
					<button @click="movNode({ at : path, dir : true })">&#x21e3;</button>
				</div>

			</template>
			<template v-else>
				<input disabled :value="'Raíz'"/>
			</template>
			<button class="btn btn-stl" style="order: 0" @click="updStyle">&#x2699;</button>
		</div>

		<div v-show="!collapse" class="tree-branches">
			<template v-for="(e, i) of tree.c">
				<div v-if="(typeof e === 'string')" class="branch-text" :key="`${path}-${i}`">
					
					<span class="btn index">{{ i }}</span> 
					<input type="text" :value="e" @change="e => putNode({ at : i, val : (e.target as HTMLInputElement).value! }, [path])"/>
					<div class="position-action-btns">
						<button @click="movNode({ at : path, dir : false })">&#x21e1;</button>
						<button @click="movNode({ at : path, dir : true })">&#x21e3;</button>
					</div>
					<button class="btn btn-del" @click="delNode({ at : i }, [path])">&#xd7;</button>

				</div>
				<TreeInspector v-else :key="e.i"
					:tree="e"
					:path="i"
					@action="(type : string, spath : number[], v? : string) => $emit('action', type, [path, ...spath], v)"/>
			</template>
		</div>

	</div>


</template>

<style>
.branch-inspector {
	& {
		font-size: 12px;
		--border-color : #acc;
	}
	
	& :is(select, input, output) {
		font-size: inherit;
		height: 1.75rem;
		flex : 1 0 auto;

		padding: .25rem .5rem .25rem;
		background-color: #1238;

		border: none;
		border-inline: 1px solid var(--border-color, white);

		line-height: 1;
	}
	
	& > :first-child {
		background-color: #288;
		padding : 0rem .25rem;
		border : 1px solid var(--border-color, white);
		
		display: flex;
		gap : .25rem;
		align-items: center;
		border-radius: .5rem .5rem 0 0;
	}

	& > :last-child {		
		display: flex;
		flex-direction: column;
		gap : .5rem;

		border-left: 2px dashed #fff6;
		padding-top : .5rem;
		padding-left : .25rem;
	}
	
	.branch-text {
		& {
			background-color: #6aa;
			border : 1px solid var(--border-color, white);
			padding : .0rem .25rem;

			display: flex;
			gap : .25rem;
			align-items: center;
		}
		&:last-child {
			border-radius: 0 0 .5rem 0;
		}
	}

	

	& .btn {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;

		border: 1px solid var(--border-color, white);

		aspect-ratio: 1;
		width: 1.25rem;
		border-radius: 50%;
	}

	& .index {
		font-size: x-small;
		cursor: auto;
		background-color: #334;
	}

	& .btn-toggle { background-color: #334;	}
	& .btn-del { background-color: #a33;	}
	& .btn-stl { background-color: #323; }

	& .control-action-btns {
		& {
			display: flex;
		}

		& > button {
			& {
				font-size: inherit;
				background-color: #334;
				padding : .125rem .75rem;
				
				border: 1px none var(--border-color, white);
				border-style: solid solid solid none;
				cursor: pointer;
			}
			
			&:hover { background-color: #45c; }
			&:active { background-color: #223; }

			&:last-child 	{ border-radius: 0 .5rem .5rem 0; }
			&:first-child	{ border-radius: .5rem 0 0 .5rem; border-left-style: solid; }
		}
	}
	& .position-action-btns {
		& {
			display: flex;
			flex-direction: column;
			overflow: hidden;
			align-self: stretch;
		}

		& > button {
			& {
				flex : 1 0 0;
				font-size: inherit;
				background-color: #334;
				padding : 0rem .5rem;
				
				border: 1px none var(--border-color, white);
				border-style: solid solid none solid;
				cursor: pointer;
			}
			
			&:hover { background-color: #45c; }
			&:active { background-color: #223; }

			&:first-child	{ border-top: none; }
		}
	}
}
</style>