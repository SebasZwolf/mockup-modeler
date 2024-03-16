import { alignments } from './const'

export type t_type = 'basic' | 'img' | 'button' | 'text';
export type t_align = typeof alignments[number];

export type t_numbers = [number, number?, number?, number?];

export type t_flow = 'column' | 'row';
export type t_colour = 'transparent' | `#${string}`;

type container_props = {
	flow : t_flow,
	gap : number,

	justify : string,
}

type box_props = {
	pad : t_numbers;
	bg : t_colour;

	border_color : t_colour;
	border_w : t_numbers;
}

export type to_basic = Partial<container_props & box_props>;

export type to_button = {
	disabled? : boolean;
}

export type to_img = {
	w? : number;
	h? : number;
};

export type to_text = {
	style? : string;
	color? : t_colour;
	fsize? : number;

	alignment? : t_align;

	B? : boolean;
	I? : boolean;
	U? : boolean;
};

export type t_opts = to_basic | to_button | Record<string, unknown>;

export type custom_tree_item = {
	key : number;
	type : t_type;

	meta? : string;
	opts? : t_opts;
};

export type custom_tree_item_adv = {
	key : number;
	type : t_type;

	meta? : string;
} & ({
	type : 'basic';
	opts? : to_basic;
} | {
	type : 'button';
	opts? : to_button;
} | {
	type : 'img';
	opts? : to_img;
} | {
	type : 'text';
	opts? : to_text;
});


export type raw_tree_branch<T extends unknown | (Record<string, unknown> & { key? : number }) = unknown> = [T, raw_tree_branch<T>[]?];

export type custom_tree_branch = raw_tree_branch<custom_tree_item>;



export type t_icon = 
	'caret-r' |
	'caret-l' |
	'caret-u' |
	'caret-d' |
	'plus' |
	'trash' |
	'circle' |
	'dot';