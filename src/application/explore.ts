import type {
  Place,
  Story,
  Person,
  Relation,
  LiteraryEntry,
} from "../domain/models";

export function searchPlaces(places: Place[], query: string) {
  const term = query.trim();
  return places.filter((p) =>
    `${p.name}${p.resident}${p.alias}`.includes(term),
  );
}

export function searchPeople(people: Person[], query: string) {
  const term = query.trim();
  return people.filter((p) => `${p.name}${p.alias}`.includes(term));
}

/** 一个人的一跳关系；来自关系的双方都以人物标识存储。 */
export function relationsFor(
  person: Person,
  relations: Relation[],
  people: Person[],
) {
  return relations
    .filter((r) => r.from === person.id || r.to === person.id)
    .map((r) => {
      const otherId = r.from === person.id ? r.to : r.from;
      return {
        relation: r,
        other: peopleById(people, otherId),
      };
    });
}

/** 与某人直接关联的人物 ids（用于图谱聚焦）。 */
export function relationClique(
  person: Person,
  relations: Relation[],
): string[] {
  const set = new Set<string>([person.id]);
  relations.forEach((r) => {
    if (r.from === person.id) set.add(r.to);
    if (r.to === person.id) set.add(r.from);
  });
  return [...set];
}

export function peopleById(people: Person[], id: string) {
  return people.find((p) => p.id === id);
}

/** 某人的文学条目：优先其居所相关条目，其次其受邀诗词。 */
export function literaryForPerson(
  person: Person,
  all: LiteraryEntry[],
  stories: Story[],
) {
  const name = person.name;
  const poemIds = new Set(
    stories
      .filter((s) => s.people.includes(name))
      .flatMap((s) => s.poems),
  );
  // 以“作者/人物出现在该条目”作为归属判断，诗词多为作者所赋。
  return all.filter(
    (l) =>
      l.author === name ||
      (l.kind === "poem" && poemIds.has(l.id)),
  );
}

export function storiesAt(stories: Story[], placeId: string) {
  return stories.filter((s) => s.places.includes(placeId));
}

/** 地点改变时清除不相容情节，避免把旧诗词和路线带到另一处院落。 */
export function selectPlace(currentStory: Story | undefined, placeId: string) {
  return {
    placeId,
    storyId: currentStory?.places.includes(placeId) ? currentStory.id : null,
  };
}

export function selectStory(story: Story, currentPlace: string) {
  return {
    storyId: story.id,
    placeId: story.places.includes(currentPlace)
      ? currentPlace
      : story.places[0],
  };
}
