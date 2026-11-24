import Root from './navigation-menu.svelte';
import Content from './navigation-menu-content.svelte';
import Item from './navigation-menu-item.svelte';
import Link from './navigation-menu-link.svelte';
import List from './navigation-menu-list.svelte';
import Trigger from './navigation-menu-trigger.svelte';
import Viewport from './navigation-menu-viewport.svelte';

/** Shared by triggers and by top-level links that sit next to them. */
export const navigationMenuTriggerStyle =
	'ring-offset-background focus-visible:ring-ring inline-flex h-9 items-center justify-center gap-1 rounded-md px-3 text-sm font-medium transition-colors hover:bg-current/10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden data-[state=open]:bg-current/10';

export {
	Content,
	Item,
	Link,
	List,
	//
	Root as NavigationMenu,
	Content as NavigationMenuContent,
	Item as NavigationMenuItem,
	Link as NavigationMenuLink,
	List as NavigationMenuList,
	Trigger as NavigationMenuTrigger,
	Viewport as NavigationMenuViewport,
	Root,
	Trigger,
	Viewport
};
