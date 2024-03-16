<script lang="ts" setup>
import { alignments } from '../util/const'
import * as Inputs from '../components/input';
import type { custom_tree_item_adv, t_numbers } from '../util/types';

const p = defineProps<{
	selection : custom_tree_item_adv;
}>();

function update(e : Partial<custom_tree_item_adv['opts']>) {
	p.selection.opts = Object.assign({}, p.selection.opts!, e);
};

function meta(e : custom_tree_item_adv['meta']) {
	p.selection.meta = e;
};

const justifyOptions = ['start','center','end','spaced'] as const;

</script>

<template>
	<section class="h-full w-full flex flex-col gap-1 text-sm">
		<header class="">
			<code>
				ID:
				<span title="ID" class="bg-orange-300 text-black px-2 py-0.5 leading-none self-center rounded inline-block">
					{{ p.selection.key }}
				</span>
			</code>
			<code>
				Elemento:
				<span title="ID" class="bg-violet-300 text-black px-2 py-0.5 leading-none self-center rounded inline-block">
					{{ p.selection.type }}
				</span>
			</code>
		</header>
		<section class="grid grid-flow-row gap-0	" style="grid-auto-rows: 1.5rem;" v-if="p.selection.type === 'basic'">

			<label class="flex items-center gap-1 w-fit">
				<span class="mr-2">orientación: </span>
				<span class="leading-tight font-bold">H</span>
					<button type="button" @click="update({ flow : p.selection.opts?.flow !== 'row' ? 'row' : 'column' })"
				class="switch bg-cyan-800 block h-4 w-7 rounded-full relative has-[>.active]:bg-violet-300 transition-colors"
				title="cambiar dirección">
					<div :class="{ 'active' : p.selection.opts?.flow !== 'row' }"
						class="absolute h-full top-0 aspect-square bg-white p-0.5 bg-clip-content rounded-full"></div>
				</button>
				<span class="leading-tight font-bold">V</span>
			</label>

			<div class="flex items-center gap-1">
				<span class="mr-2">distribución: </span>
				<Inputs.Pick :key="p.selection.key" :initial="p.selection.opts?.justify" :options="justifyOptions" 
					@change="v => update({ justify : v })"
					name="justify-content"/>
			</div>

			<div class="flex items-center gap-1">
				<span class="mr-2">separación: </span>
				<Inputs.Number :vmin="0" :key="p.selection.key" :initial="p.selection.opts?.gap" @change="v => update({ gap : v })"/>
			</div>

			<div class="flex items-center gap-1">
				<span class="mr-2">espaciado: </span>
				<Inputs.Numbers :initial="(p.selection.opts?.pad as any)" @change="v => update({ pad : v as t_numbers })"/>
			</div>

			<div class="flex items-center gap-1 w-fit">
				<span class="mr-2">color de fondo: </span>
				<Inputs.Color :key="p.selection.key" :initial="p.selection.opts?.bg" @change="v => update({ bg : v })" />
			</div>

		</section>
		<section class="flex flex-col gap-1" v-else-if="p.selection.type === 'img'">
			<div class="flex items-center gap-2">
				<label>
					<code class="text-sm leading-tight font-bold mr-1">width:</code>
					<input class="text-right px-2 w-16 rounded" type="number" min="8" step="1" @change="update({
						w : +($event.target as HTMLInputElement).value,
					})" :value="p.selection.opts?.w"/>
				</label>
				<label>
					<code class="text-sm leading-tight font-bold mr-1">height:</code>
					<input class="text-right px-2 w-16 rounded" type="number" min="8" step="1" @change="update({
						h : +($event.target as HTMLInputElement).value,
					})" :value="p.selection.opts?.h"/>
				</label>
			</div>
		</section>
		<section class="flex flex-col gap-1" v-else-if="p.selection.type === 'text'">


			<div class="flex items-center gap-1">
				<span class="mr-2">tamaño: </span>
				<Inputs.Number :vmin="10" :vmax="20" :key="p.selection.key" :initial="p.selection.opts?.fsize ?? 11" @change="v => update({ fsize : v })"/>
			</div>

			<div class="flex items-center gap-1">
				<span class="mr-2">alineación: </span>
				<Inputs.Pick :key="p.selection.key" name="aligment" :initial="'left'" :options="alignments" @change="v => update({ alignment : v as any })"/>
			</div>

			<div class="flex items-center gap-1" >
				<span class="mr-2">estilos: </span>
				<ul class="option-selector group text-xs gap-[1px] bg-current border border-current rounded overflow-clip grid grid-flow-col" style="grid-auto-columns: 1fr;">
					<li class="block">
						<label class="cursor-pointer w-full text-center px-2 pt-0.5 pb-1 bg-cyan-800 block has-[input:checked]:bg-violet-300 has-[input:checked]:text-black">
							<input type="checkbox" hidden />
							<span class="font-bold">B</span>
						</label>
					</li>
					<li class="block">
						<label class="cursor-pointer w-full text-center px-2 pt-0.5 pb-1 bg-cyan-800 block has-[input:checked]:bg-violet-300 has-[input:checked]:text-black">
							<input type="checkbox" hidden />
							<span class="italic">I</span>
						</label>
					</li>
					<li class="block">
						<label class="cursor-pointer w-full text-center px-2 pt-0.5 pb-1 bg-cyan-800 block has-[input:checked]:bg-violet-300 has-[input:checked]:text-black">
							<input type="checkbox" hidden />
							<span class="underline">U</span>
						</label>
					</li>
				</ul>
			</div>

			<div class="flex items-center gap-1">
				<span>color de texto: </span>
				<Inputs.Color :key="p.selection.key" :initial="p.selection.opts?.color ?? '#ffffff'" @change="v => update({ color : v })" />
			</div>

			<label class="border rounded bg-cyan-800">
				<span class="block p-1 px-2 bg-white text-black rounded-ee w-fit">color de texto: </span>
				<textarea  :value="p.selection.meta" class="p-2 pt-1 w-full resize-none bg-transparent outline-none" rows="6" @change="v => meta((v.target as HTMLInputElement).value/*.split('\n').join('\n')*/)"></textarea>
			</label>
			
			

		</section>
	</section>
</template>

<style>
.switch  > div:only-child {
	transition-property: left translate;
	transition-duration: .35s;
	transition-timing-function: cubic-bezier(0.39, 0.575, 0.565, 1);
	left : 0%;
	translate : 0 0;
}

.switch:has(.active) > div:only-child {
	left : 100%;
	translate : -100% 0;
}
</style>