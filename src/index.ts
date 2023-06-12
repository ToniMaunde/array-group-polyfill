type Item = {
	name: string;
	type: string;
	quantity: number;
}

// WIP
type Condition<T, CriteriaValue> = {
	value: keyof T;
	criteria: CriteriaValue;
	groups: Array<keyof T>t ;
}

function arrayGroup<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: Condition<T>) {

	// init return object
	const groupingObject: Record<string, T[]> = {};

	if (condition !== undefined) {

		return groupingObject;
	} else {
		const valuesForAttributeToGroupBy = collection.map(item => item[attributeName]);

		for (const attributeValue of valuesForAttributeToGroupBy) {
			const itemsGroup = collection.filter(item => item[attributeName] === attributeValue);

			// convert the attributeValue to string before using it as a key
			groupingObject[attributeValue as string] = itemsGroup;


			return groupingObject;
		};


	}
}

const inventory: Item[] = [
	{ name: "asparagus", type: "vegetables", quantity: 5 },
	{ name: "bananas", type: "fruit", quantity: 0 },
	{ name: "goat", type: "meat", quantity: 23 },
	{ name: "cherries", type: "fruit", quantity: 5 },
	{ name: "fish", type: "meat", quantity: 22 },
];

// For working with discrete values
const groupedItems = arrayGroup(inventory, "type");

console.log(groupedItems);
