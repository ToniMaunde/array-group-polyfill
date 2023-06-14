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

type FootballPlayer = {
	fullName: string;
	club: string;
	jerseyNo: number;
}

type Country = {
	name: string;
	population: number;
	year: number;
}

// And check your phone

type GroupingCondition = {
	value: string | number | boolean;
	criterion: "EQUAL_STRINGS" | "STRING_INCLUDES" | "EQUAL_BOOLEANS" | "EQUAL_NUMBERS" | "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL";
	caseSensitive?: boolean;
	groupMeetsCriterion?: string;
	groupFailsCriterion?: string;
}

function arrayGroup<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: GroupingCondition) {

	const groupingObject: Record<string, T[]> = {};

	if (condition !== undefined) {

		const caseSensitive = condition.caseSensitive ?? true;
		const meetsCriterion = condition.groupMeetsCriterion ?? "passes";
		const failsCriterion = condition.groupFailsCriterion ?? "fails";

		if (condition.criterion === "EQUAL_BOOLEANS") {
			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) === condition.value
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as boolean) !== condition.value
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "EQUAL_STRINGS") {
			const valueAsString = condition.value as string;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string) === valueAsString
				}
				return (element[attributeName] as unknown as string).toLowerCase() === valueAsString.toLowerCase()
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string) !== valueAsString
				}
				return (element[attributeName] as unknown as string).toLowerCase() !== valueAsString.toLowerCase()
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "STRING_INCLUDES") {
			const valueAsString = condition.value as string;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
					return (element[attributeName] as unknown as string).includes(valueAsString)
				}
				return (element[attributeName] as unknown as string).toLowerCase().includes(valueAsString.toLowerCase())
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				if (caseSensitive) {
				return !(element[attributeName] as unknown as string).includes(valueAsString)
				}
				return !(element[attributeName] as unknown as string).toLowerCase().includes(valueAsString.toLowerCase())
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "EQUAL_NUMBERS") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) === valueAsNumber
			});

			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) !== valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "GREATER_THAN") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "GREATER_THAN_OR_EQUAL") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) >= valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) < valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "LESS_THAN") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) < valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) >= valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

			return groupingObject;
		}

		if (condition.criterion === "LESS_THAN_OR_EQUAL") {
			const valueAsNumber = condition.value as number;

			const innerCollectionForMatchingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) <= valueAsNumber
			});
			const innerCollectionForFailingCriterion: T[] = collection.filter(element => {
				return (element[attributeName] as unknown as number) > valueAsNumber
			});

			groupingObject[meetsCriterion] = innerCollectionForMatchingCriterion;
			groupingObject[failsCriterion] = innerCollectionForFailingCriterion;

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

const footballPlayers: FootballPlayer[] = [
	{
		fullName: "Eric Cantona",
		club: "Manchester United FC",
		jerseyNo: 7
	},
	{
		fullName: "Raul Gonzalez",
		club: "Real Madrid FC",
		jerseyNo: 7
	},
	{
		fullName: "Cristiano Ronaldo",
		club: "Al Nassr",
		jerseyNo: 7
	},
	{
		fullName: "Leonel Messi",
		club: "Inter Miami",
		jerseyNo: 10
	},
	{
		fullName: "Eden Hazard",
		club: "Free agent",
		jerseyNo: 10
	},
];

const countries: Country [] = [
	{
		name: "India",
		population: 1417173173,
		year: 2022
	},
	{
		name: "China",
		population: 1425887337,
		year: 2022
	},
	{
		name: "Chad",
		population: 18001000,
		year: 2022
	},
	{
		name: "Tunisia",
		population: 12356117,
		year: 2022
	},
];

// Basic grouping using a groupable attribute
const groupedItems = arrayGroup(inventory, "type");

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

const groupedItemsUsingEqualNumbers = arrayGroup(footballPlayers, "jerseyNo", {
	value: 7,
	criterion: "EQUAL_NUMBERS",
});

const groupedItemsUsingPartialStringMatching = arrayGroup(footballPlayers, "fullName", {
	value: "r",
	caseSensitive: false,
	criterion: "STRING_INCLUDES"
});

const groupedItemsUsingGreaterThan = arrayGroup(inventory, "quantity", {
	value: 5,
	criterion: "GREATER_THAN",
	groupMeetsCriterion: "ok",
	groupFailsCriterion: "restock"
});

const groupedItemsUsingLessthan = arrayGroup(countries, "population", {
	value: 15000000,
	criterion: "LESS_THAN",
	groupMeetsCriterion: "easygoing",
	groupFailsCriterion: "pumping"
});

console.log(groupedItemsUsingLessthan);
/*
console.log(groupedItems);
console.log(groupedItemsUsingGreaterThan);
console.log(groupedItemsUsingABoolean);
console.log(groupedItemsUsingEqualNumbers);
console.log(groupedItemsUsingMatchingStrings);
console.log(groupedItemsUsingPartialStringMatching);
*/
