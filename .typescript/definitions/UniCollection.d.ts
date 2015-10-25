/// <reference path="meteor.d.ts" />
declare class UniCollection<T> extends Mongo.Collection<T> {
	constructor(string);
	helpers();
}

declare class UniDoc {}

declare module UniDoc {
	function extend() : UniDoc;
}