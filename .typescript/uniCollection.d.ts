/// <reference path="collections2.d.ts" />

declare class UniCollection<T> extends Mongo.Collection<T> {
	constructor(string);
	helpers();
	findOne(id: number): T & UniDoc
}

interface UniDoc {
	save();
}
