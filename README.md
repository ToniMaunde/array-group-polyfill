# array-group-polyfill
A project that aims to provide a polyfill for the upcoming array.prototype.group and array.prototype.groupToMap functions.

[Array.prototype.group MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group)

[Array.prototype.groupToMap MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/groupToMap)

## Directory Structure
```
.
├── .changeset
├── .github/
│   └── workflows/
│       ├── main.yml
│       └── publish.yml
├── src/
│   └── index.ts
├── .gitignore
├── CHANGELOG.md
├── package-lock.json
├── package.json
└── tsconfig.json
```

## Installing
Clone the repository
```sh
git clone https://github.com/ToniMaunde/array-group-polyfill.git
```

Then navigate inside the folder
```sh
cd array-group-polyfill
```

Install the dependencies with
```sh
npm install
```

After that is done, just run
```sh
npm run dev
```

## How it works
You pass an array of objects and specify a property from an object that you intend to be used for the grouping. If you want to use a criterion alongside the property for grouping, you can pass a third argument that is an object with the criterion (as an enum), the value (as number, string or boolean), the case sensitity for a string related criterion (as a boolean), a name for the property that will hold the array of the elements of the original collection that satify the criterion and a name for the property for those who do not. Since you're weird like me, find below the type and function declaration since I'm sure that'll be easier to understand than my fat paragraph above.

```ts 
type GroupingCondition = {
	value: string | number | boolean;
	criterion: "EQUAL_STRINGS" | "STRING_INCLUDES" | "EQUAL_BOOLEANS" | "EQUAL_NUMBERS" | "GREATER_THAN" | "LESS_THAN" | "GREATER_THAN_OR_EQUAL" | "LESS_THAN_OR_EQUAL";
	caseSensitive?: boolean;
	groupMeetsCriterion?: string;
	groupFailsCriterion?: string;
}

function group<T extends Object, KeyType extends keyof T>(collection: T[], attributeName: KeyType, condition?: GroupingCondition) {

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
```

## Examples
All examples will be based on this array
```ts 
const inventory = [
  { name: "asparagus", type: "vegetables", quantity: 5 },
  { name: "bananas", type: "fruit", quantity: 0 },
  { name: "goat", type: "meat", quantity: 23 },
  { name: "cherries", type: "fruit", quantity: 5 },
  { name: "fish", type: "meat", quantity: 22 },
];
```

1. Grouping by the **type** attribute
```ts 
const grouping = arrayGroup(inventory, "type");

/* Result is:
{
  vegetables: [
    { name: 'asparagus', type: 'vegetables', quantity: 5 },
  ],
  fruit: [
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "cherries", type: "fruit", quantity: 5 }
  ],
  meat: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 }
  ]
}
*/
```

2. Grouping by the **quantity** attribute with a criterion of 'quantity' > 5
```ts 
const grouping = arrayGroup(inventory, "quantity", {
  value: 5,
  criterion: "GREATER_THAN",
  groupMeetsCriterion: "ok",
  groupFailsCriterion: "restock"
});

/* Result is:
{
  restock: [
    { name: "asparagus", type: "vegetables", quantity: 5 },
    { name: "bananas", type: "fruit", quantity: 0 },
    { name: "cherries", type: "fruit", quantity: 5 }
  ],
  ok: [
    { name: "goat", type: "meat", quantity: 23 },
    { name: "fish", type: "meat", quantity: 22 }
  ]
}
*/
```

Need more examples? Let me know.

## Built with
I used Typescript for building this package.

## Contributing
1. Check the existing issue backlog
2. Comment that you'll be working on it 
3. Add a changeset to the issue/feature branch you'll use for the development
4. Submit a PR
All help is welcome :).

## Authors
Me, myself and I...thus far.

## License
The MIT license.
