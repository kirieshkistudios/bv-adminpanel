// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
	  interface PageData {
		tableData: Array<Record<string, any>>;
	  }
	  interface Locals {
		user?: {
		  username: string;
		};
	  }
	}
  }
  export {};


export {};
