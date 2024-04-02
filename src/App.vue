<script lang="ts" setup>

import { onMounted, reactive, ref, shallowReactive, shallowRef } from 'vue';
import { default as Recursion, type t_slotprops as recursed } from 'vue-recursion';
import Icons from './fragments/Icons.vue'

import type { 
	custom_tree_item_adv as t_item,
	custom_tree_branch as t_node,
	t_type
} from './util/types';
import Inspector from './fragments/Inspector.vue';

let objId = 0;

function create_item(type: t_type = 'basic', meta?: string) {


	return shallowReactive({
		type,
		key: objId++,
		meta,
	}) as t_item;
}
function create_tree([node, children]: t_node): t_node {
	return [
		shallowReactive(node),
		children && shallowReactive(children.map(create_tree))
	];
};

const data: t_node = reactive([
	create_item(), [
		[create_item(), [
			[create_item(), [
				[create_item()],
				[create_item('text')],
			]],
			[create_item('img')],
		]],
		[create_item(), [
			[create_item('button', 'click me!')],
			[create_item('button', 'click me!')],
			[create_item()],
		]],
		[create_item()],
	]
]);

const treeRoot = ref<null | HTMLDivElement>(null);

const zoom = reactive({
	level: 1,
	['+']() {
		this.level = Math.min(this.level + .25, 2)
	},
	['-']() {
		this.level = Math.max(this.level - .25, .5)
	},
});

onMounted(() => {
	const tree: HTMLDivElement = treeRoot.value!;
	const pos: [number, number] = [tree.parentElement!.offsetWidth * .5 - tree.offsetWidth * .5, tree.parentElement!.offsetHeight * .5 - tree.offsetHeight * .5];
	tree.style.left = `${pos[0]}px`;
	tree.style.top = `${pos[1]}px`;
	tree.dataset.pos = JSON.stringify(pos);
});

function drag(ev: MouseEvent) {
	const el = ev.target as HTMLDivElement;
	const
		ox = ev.clientX,
		oy = ev.clientY;

	el.style.zIndex = '10';

	const tree: HTMLDivElement = treeRoot.value!;

	const [tx, ty] = JSON.parse(tree.dataset['pos']!);

	let wait = false;
	el.onmousemove = ev2 => {
		if (wait) return;

		wait = true;
		setTimeout(() => wait = false, 16.68);

		const
			dx = ev2.clientX,
			dy = ev2.clientY;

		tree.style.left = `${tx + dx - ox}px`;
		tree.style.top = `${ty + dy - oy}px`;
	};

	el.onmouseup = ev2 => {
		el.onmousemove = null;
		el.onmouseup = null;
		el.style.zIndex = '';

		const
			fx = ev2.clientX,
			fy = ev2.clientY;

		tree.dataset['pos'] = JSON.stringify([tx + fx - ox, ty + fy - oy]);
	};
}

const selection = shallowRef<t_item | null>(data[0] as t_item);

import * as tag from './components/nodes'
import NodeControl from './components/NodeControl.vue';

const tree_navigate = (chain : number[], tree : t_node = data) => chain.reduce<t_node>((pr, c) => pr[1]![c], tree);

const inspector = {
	swap : (chain : number[], pos : number) => {
		if (pos < 0)
			return console.warn("attempted to move to negative");
		
		const i = chain.pop()!;
		const [parent, siblings] = tree_navigate(chain);

		if (!siblings?.length)
			return console.error(`node ${parent.key} does not have children`);
		
		if (siblings.length <= pos)
			return console.warn("attempted to move outside range")

		siblings.splice(pos, 0, ...siblings.splice(i, 1));
	},
	del : (chain : number[], el : HTMLElement) => {
		const i = chain.pop()!;

		const t = tree_navigate(chain);

		if( !t[1]?.length )
			return console.warn('parent does not have children');

		const self : HTMLElement = el.closest('.inspector')!;
		const parent : HTMLElement = self.parentElement!.closest('.inspector')!;

		const [old] = t[1]!.splice(i, 1);

		if (old[0].key === selection.value?.key) {
			parent.querySelector<HTMLInputElement>(`input[type=radio]`)!.checked = true;
			selection.value = t[0] as t_item;
		}
	},
	add : (chain : number[], el : HTMLElement) => {
		const parent = tree_navigate(chain);

		const self : HTMLElement = el.closest('.inspector')!;
		self.querySelector<HTMLInputElement>(`input[type=radio]`)!.checked = true;

		const n = ([{
			key : objId++,
			type : 'basic',
			opts : {
				flow : 'column',
				gap : 0,
			}
		}] as t_node);

		if(parent[1]) 
			parent[1].push(n);
		else
			parent.push(([n]));
	}
}

const leave = function (el: HTMLElement) {
	el.style.top = `${el.offsetTop}px`;
	el.style.zIndex = '10';
}

const select = (data : t_item) => selection.value = data; 

</script>

<template>
	<Icons />
	<div class="base">
		<div class="row-start-1 row-span-1 col-start-1 overflow-y-scroll p-2">
			
			<div class="inspector">
				<Recursion :data="data" v-slot="{ index, children, depth, chain, data, components } : recursed<t_item>">

					<NodeControl :data="data" :depth="depth" :children="children" 
						@selection="select(data)"
						@add="inspector.add(chain, $event)"
						@del="inspector.del(chain, $event)"
						@move="inspector.swap(chain, index + $event)">
						<!-- <TransitionGroup tag="ul" name="list" class="flex flex-col gap-2 relative" @before-leave="leave($event)">
							<li class="inspector w-full" v-for="c in components" :key="c.key">
								<component :is="c" />
							</li>
						</TransitionGroup> -->
					</NodeControl>

					<div v-if="children.length" class="collapse-show pl-2 pt-2 rounded-es-md">
						<TransitionGroup tag="ul" name="list" class="flex flex-col gap-2 relative" @before-leave="leave($event as HTMLElement)">
							<li class="inspector w-full" v-for="c in components" :key="(c as any).key">
								<component :is="c" />
							</li>
						</TransitionGroup>
					</div>
					
				</Recursion>
			</div>	

		</div>
		<div v-if="selection" class="row-start-2 row-span-1 col-start-1 p-2 pt-1 relative"
			style="box-shadow: 0 -.5rem .5rem .5rem var(--bg-color)">
			<div class=" border-2 bg-cyan-600 border-white h-64 rounded -scale-y-100 resize-y overflow-hidden"></div>
			<div class="absolute inset-4">
				<!-- <Inspector :selection="selection" :key="selection.key" /> -->
				<Inspector :selection="selection" />
			</div>
		</div>
		<div class="border-l-2 border-white relative overflow-clip row-start-1 row-span-2 col-start-2 ">

			<div class="inset-0 bg-lime-300/5 absolute cursor-move" @mousedown.left="drag"></div>

			<div ref="treeRoot" tabindex="0" :style="{ scale: `${zoom.level}` }"
				class="rounded p-1 block overflow-hidden resize text-sm w-[320px] h-[480px] bg-white/5 absolute">

				<div class="tree-pot contents text-xs" v-if="true">
					<Recursion :data="data" v-slot="{ component, children, data } : recursed<t_item>">
						<component :is="tag[data.type]" :meta="data.meta" v-bind="data.opts">
							<component v-memo="[children]" v-if="children.length" :is="component" />
						</component>
					</Recursion>
				</div>

				<textarea v-else class="text-xs w-full h-full" :value="JSON.stringify(data, null, 1)"></textarea>
			</div>

			<aside class="absolute bottom-0 w-full flex justify-center p-1">
				<div
					class="border w-fit font-medium rounded-md flex gap-x-[1px] text-sm leading-none bg-gray-200 border-gray-200 overflow-hidden"
					role="group">
					<button @click="zoom['-']" type="button" class="px-3 py-2 bg-gray-800
						text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
						-</button>
					<output :value="zoom.level.toFixed(2)" class="px-3 py-2 bg-gray-900 tabular-nums
						text-white "></output>
					<button @click="zoom['+']" type="button" class="px-3 py-2 bg-gray-800
						text-white hover:bg-gray-700 focus:ring-blue-500 focus:text-white">
						+</button>
				</div>
			</aside>
		</div>

	</div>
</template>

<style>
.base {
	height: 100vh;

	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-rows: 1fr auto;
}
</style>
<style>
	.list-move, .list-enter-active, .list-leave-active {
		transition: transform .3s ease, opacity .3s ease;
	}
	.list-enter-from, .list-leave-to {
		opacity: 0;
		transform: translateX(6rem);
	}
	.list-leave-active { position: absolute; }
</style>

<style>
	.collapse-show { display: none; }
	.inspector:has(input[type="radio"]:checked) {
		& > .label .collapse-hide { display: none; }
		& > .label .collapse-show { display: block; }

		& > .collapse-hide { display: none; }
		& > .collapse-show { display: block; }
	}
	.inspector:has(> .label input[type="radio"]:checked) > .label {
		&  {
			border-color: gold;
			box-shadow: 0 0 0 1px gold;
		}
		& label svg { color: gold; }
	}
</style>
