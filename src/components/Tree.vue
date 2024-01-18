<script lang="ts">
import { PropType, RendererElement, RendererNode, VNode, defineComponent, h } from 'vue';

const presets = {
	'root' : defineComponent((p, { slots }) => () => h('div', { class : 'root', ...p }, slots.default?.())),

	'vsep' : defineComponent((p, { slots }) => () => h('div', { class : 'vsep', ...p }, slots.default?.())),
	'hsep' : defineComponent((p, { slots }) => () => h('div', { class : 'hsep', ...p }, slots.default?.())),

	'cont' : defineComponent((p, { slots }) => () => h('div', { class : 'cont', ...p }, slots.default?.())),
} as const satisfies Record<string, unknown>;

export type e_element = keyof typeof presets;

type t_c_flow = Extract<e_element,'vsep'|'hsep'>;
type t_c_size = Extract<e_element,'cont'>;

export type t_branch = string | (
	{ b? :  Record<string, unknown> } & ({ t : t_c_flow, c : t_branch[] } | { t : t_c_size, c : [t_branch] })
);
export type t_root = { 
	t : Extract<e_element,'root'>,
	c : t_branch[],
	b?: never,
};

const Tree = defineComponent({
	props : {
		branch : {
			type : null as  unknown as PropType<t_branch | t_root>,
			required : true,
		}
	},
	setup(p, {}){

		return function() : VNode {

			if ( typeof p.branch === 'string' ) 
				return h('span', { class : 'text' }, p.branch);

			const { c, t, b = null } = p.branch;

			return h(presets[t], b, {
				default : () => c.map( branch => h(Tree, { branch }))
			});
		}
	}
});

export default Tree;
</script>

<style>
.root{
	& {
		display: flex;
		flex-direction: column;
		gap : 2px;
		height: 100%;
		
		background-color: beige;
	}

	& div {
		display: flex;
		border: 1px solid var(--border-color, transparent);
		gap : 2px;

		padding: 2px;
	}

	.text {
		display: inline-block;
		align-self: center;
		height: fit-content;
	}
}

.vsep{
	flex-direction: column;
	--border-color:lime;
}
.hsep{
	flex-direction: row;
	--border-color: maroon;
}

</style>