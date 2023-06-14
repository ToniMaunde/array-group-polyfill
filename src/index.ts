type Item = {
	name: string;
	type: string;
	quantity: number;
}

type User = {
	username: string;
	loggedIn: boolean;
	firstName: string;
	lastName: string;
}

type GroupingCondition = {
	value: string | number | boolean;
	criterion: "EQUAL_STRINGS" | "EQUAL_NUMBERS" | "EQUAL_BOOLEANS" | "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL";
	caseSensitive?: boolean;
	groupMeetsCriterion: string;
	groupFailsCriterion: string;
}

function arrayGroup<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: GroupingCondition) {

	const groupingObject: Record<string, T[]> = {};

	if (condition !== undefined) {

		if (condition.criterion === "EQUAL_BOOLEANS") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) === condition.value
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) !== condition.value
			});

			groupingObject[condition.groupMeetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[condition.groupFailsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "EQUAL_STRINGS") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				if (condition.caseSensitive) {
					return (element[attributeName] as unknown as string).toLowerCase() === (condition.value as string).toLowerCase()
				}
				return (element[attributeName] as unknown as string) === condition.value
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as string) !== condition.value
			});

			groupingObject[condition.groupMeetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[condition.groupFailsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "GREATER_THAN") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > (condition.value as number)
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= (condition.value as number)
			});

			groupingObject[condition.groupMeetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[condition.groupFailsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		return groupingObject;
	}

	// Default grouping behavior
	const valuesForAttributeToGroupBy = collection.map(item => item[attributeName]);

	for (const attributeValue of valuesForAttributeToGroupBy) {
		const itemsGroup = collection.filter(item => item[attributeName] === attributeValue);

		const attributeValueAsAString = attributeValue as string;
		groupingObject[attributeValueAsAString] = itemsGroup;
	};

	return groupingObject;
}

// Examples
const inventory: Item[] = [
	{ name: "asparagus", type: "vegetables", quantity: 5 },
	{ name: "bananas", type: "fruit", quantity: 0 },
	{ name: "goat", type: "meat", quantity: 23 },
	{ name: "cherries", type: "fruit", quantity: 5 },
	{ name: "fish", type: "meat", quantity: 22 },
];

const users: User[] = [
	{
		username: "Rocky",
		loggedIn: false,
		firstName: "Rocky",
		lastName: "Balboa"
	},
	{
		username: "Baba yaga",
		loggedIn: true,
		firstName: "John",
		lastName: "Wick"
	},
	{
		username: "The Punisher",
		loggedIn: true,
		firstName: "Frank",
		lastName: "Castle"
	},
	{
		username: "Spiderman",
		loggedIn: false,
		firstName: "Peter",
		lastName: "Parker"
	},
	{
		username: "Budget Spiderman",
		loggedIn: true,
		firstName: "Miles",
		lastName: "Parker"
	},
];

// Basic grouping using a groupable attribute
const groupedItems = arrayGroup(inventory, "type");

// Grouping using a criterion
const groupedItemsUsingGreaterThan = arrayGroup(inventory, "quantity", { value: 5, criterion: "GREATER_THAN", groupMeetsCriterion: "ok", groupFailsCriterion: "restock" });

const groupedItemsUsingABoolean = arrayGroup(users, "loggedIn", {
	value: true,
	criterion: "EQUAL_BOOLEANS",
	groupMeetsCriterion: "online",
	groupFailsCriterion: "offline"
});

const groupedItemsUsingMatchingStrings = arrayGroup(users, "lastName", {
	value: "Parker",
	criterion: "EQUAL_STRINGS",
	groupMeetsCriterion: "Spiders",
	groupFailsCriterion: "Humans"
});

console.log(groupedItems);
console.log(groupedItemsUsingGreaterThan);
console.log(groupedItemsUsingABoolean);
console.log(groupedItemsUsingMatchingStrings);
