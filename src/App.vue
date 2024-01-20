<script lang="ts">
import './style.css'
import { PropType, defineComponent, h, reactive, ref } from 'vue';

import { default as Tree, type t_branch, type t_root } from './components/Tree.vue'
import { default as TreeInspector } from './components/TreeInspector.vue'

type t_body_branch = Exclude<t_branch, string>;

const CSS = `
.root{
	& {
		display: flex;
		flex-direction: column; 
		height: 100%;
		background-color: beige;
		gap : 2px;
	}

	& div {
		display: flex;
		gap : 2px;
		padding: 2px;
		border: 1px solid var(--border-color, transparent);
	}
}
.text {
	display: inline-block;
	align-self: center;
	height: fit-content;
}.vsep{
	flex-direction: column;
	--border-color:lime;
}
.hsep{
	flex-direction: row;
	--border-color: maroon;
}
`

export default defineComponent({
	setup() {
		let objId = 0;

		const tree = reactive<t_root>({
			t : 'root',
			i : objId++,
			c : [
				{
					t : 'hsep',
					i : objId++,
					c : [
						'logo',
						{
							t : 'hsep',
							i : objId++,
							b : {
								style : 'margin-left: auto;'
							},
							c : [
								'link',
								'link',
								'link',
								'link',
							]
						}
					]
				},
				{
					t : 'hsep',
					i : objId++,
					b : {
						style : 'min-height: 14em;'
					},
					c : [
						{
							t : 'vsep',
							b : {
								style : 'flex: 1 0 0;'
							},
							i : objId++,
							c : [
								'idea','idea'
							],
						},
						{
							t : 'vsep',
							b : {
								style : 'flex: 1 0 0;'
							},
							i : objId++,
							c : [],
						},
						{
							t : 'vsep',
							c : ['idea','idea'],
								i : objId++,
						}
					]
				}
			]
		});

		const selection = ref<null | [t_body_branch, number[]]>(null);
		const styleEditor = ref<null | HTMLTextAreaElement>(null);

		return {
			tree,
			selection,
			styleEditor,
			treeRoot : ref<null | HTMLDivElement>(null),
			CSS,
			handleAction(type: string, [, ...path] : number[], v : any) {
				const getSubBranch = (p : t_body_branch | t_root, c : number) => p.c[c] as t_body_branch;

				switch(type){
					case 'del': {
						path.reduce(getSubBranch, tree).c.splice(v.at, 1);
					} break;
					case 'mov': {
						console.log('move', v);
						const from = v.at;
						const el = path.reduce(getSubBranch, tree);

						if (v.dir) {
							if (from === el.c.length - 1) 
								return void console.log('imposible tp move outside array');
						
							[el.c[from], el.c[from + 1]] = [el.c[from + 1], el.c[from]]
						}
						else {
							if (from === 0) 
								return void console.log('imposible tp move outside array');

							[el.c[from], el.c[from - 1]] = [el.c[from - 1], el.c[from]]
						}
					} break;
					case 'add': {
						path.reduce(getSubBranch, tree).c.push(typeof v === 'string' ? v : {
							c : v.c,
							t : v.t,
							b : v.b,
							i : objId++,
						});
					} break;
					case 'put': {
						path.reduce(getSubBranch, tree).c[v.at] = v.val;
					} break;
					case 'upd': {
						const node = path.reduce(getSubBranch, tree) as t_body_branch;
						selection.value = [node, path];
						styleEditor.value!.value = JSON.stringify(node.b, null, 2)
					} break;
				}
			}
		};
	},
	components : {
		Tree,
		TreeInspector
	},
});



</script>

<template>
	<div class="base">
		<div>
			<div>
				<TreeInspector :tree="tree" :path="0" @action="handleAction"/>
			</div>
			<div>
				<p style="font-family: consolas;">Nodo seleccionado: {{ selection ? `(${selection[1].join('>')})` : 'n/d' }}</p>
				<div style="margin-block: 1rem;">
					<textarea ref="styleEditor" :disabled="!selection" rows="12"></textarea>
				</div>

				
				<div>
					<button style="background-color: #33a; margin-right: auto;" @click="() => {
						console.log(`<style>${CSS}</style>\n${treeRoot?.innerHTML}`)
					}">HTML</button>
					<button style="background-color: #386;" :disabled="!selection" @click="() => {
						try {
							selection![0].b  = JSON.parse(styleEditor!.value);
						}
						catch(e) {
							console.log('invalid JSON format ');
						}
						
					}">aceptar</button>
					<button style="background-color: #a33;" :disabled="!selection" @click="() => styleEditor!.value = JSON.stringify(selection![0].b, null, 2)">cancelar</button>
				</div>
			</div>
		</div>
		<div>
			<div ref="treeRoot" tabindex="0" style="font-size: 75%; display: block; overflow: hidden; width: 320px; height: 480px; resize: both;">
				<Tree :branch="tree" />
			</div>
		</div>
	</div>
</template>

<style >
.base {
	& {
		height: 100vh;

		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr;
	}

	& > div:first-child {
		& {
			height: 100%;
			display: flex;
			flex-direction: column;
		}

		& > div:first-child {
			background-color: #24262f;
			padding : 1rem;
			flex : 1 0 0;
			overflow-y: scroll;
		}

		& > div:last-child {
			& {
				background-color: #2f2426;
				
				flex : 0 0 fit-content;
				padding : 1rem;
				border-top: 1px solid white;
			}

			& > div:has(> textarea) {
				resize: vertical;
				rotate: .5turn;
				overflow: hidden;
				direction: rtl;
			}
			& > div > textarea {
				resize: none;
				width: 100%;
				height: 100%;
				rotate: .5turn;
				direction: ltr;
				padding : .5rem;
			}

			& > div:last-child {
				display: flex; justify-content: flex-end; gap: .5rem; 
			}
			& > div:last-child > button { padding: .25rem .5rem; color: white; }
		}
	}

	& > div:last-child {
		& {
			background-color: #242f26;
			display: flex;
			justify-content: center;
			align-items: center;
			border-left: 1px solid white;
			
			overflow: hidden;
			color : black;
		}

		& > div {
			padding : .25rem;
			border: 1px dashed white;
		}
	}
}

</style>
