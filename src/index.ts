type Item = {
	name: string;
	type: string;
	quantity: number;
}

type GroupingCondition = {
	value: unknown;
	criterion: "EQUAL_STRINGS" | "EQUAL_NUMBERS" | "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL";
	passingCriterionGroupName: string;
	failingCriterionGroupName: string;
}

function arrayGroup<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: GroupingCondition) {

	// init return object
	const groupingObject: Record<string, T[]> = {};

	if (condition !== undefined) {

		if (condition.criterion === "GREATER_THAN") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > (condition.value as number)
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= (condition.value as number)
			});

			groupingObject[condition.passingCriterionGroupName] = innerCollectionForMatchingCriterion;
			groupingObject[condition.failingCriterionGroupName] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		return groupingObject;
	}
	const valuesForAttributeToGroupBy = collection.map(item => item[attributeName]);

	for (const attributeValue of valuesForAttributeToGroupBy) {
		const itemsGroup = collection.filter(item => item[attributeName] === attributeValue);

		// convert the attributeValue to string before using it as a key
		groupingObject[attributeValue as string] = itemsGroup;
	};
	return groupingObject;
}

const inventory: Item[] = [
	{ name: "asparagus", type: "vegetables", quantity: 5 },
	{ name: "bananas", type: "fruit", quantity: 0 },
	{ name: "goat", type: "meat", quantity: 23 },
	{ name: "cherries", type: "fruit", quantity: 5 },
	{ name: "fish", type: "meat", quantity: 22 },
];

// Basic grouping using a groupable attribute
const groupedItems = arrayGroup(inventory, "type");

const groupedItemsUsingACriterion = arrayGroup(inventory, "quantity", { value: 5, criterion: "GREATER_THAN", passingCriterionGroupName: "ok", failingCriterionGroupName: "restock"});

console.log(groupedItems);
console.log(groupedItemsUsingACriterion);
