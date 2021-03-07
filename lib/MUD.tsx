// LIT naming convention: "Class" (uppercase), "property" (lowercase)

const MUD_BASE_URL = "https://raw.githubusercontent.com/Multi-User-Domain/vocab/main/mud.ttl";
const MUD_CONTENT_BASE_URL = "https://raw.githubusercontent.com/Multi-User-Domain/vocab/main/mudcontent.ttl";
const MUD_LOGIC_BASE_URL = "https://raw.githubusercontent.com/Multi-User-Domain/vocab/main/mudlogic.ttl";

export const MUD = {
    account: MUD_BASE_URL + '#Account',
    charactersList: MUD_BASE_URL + '#CharacterList',
    
    Character: MUD_BASE_URL + '#Character',
    owner: MUD_BASE_URL + '#ownedBy',

    Settlement: MUD_BASE_URL + '#Settlement',
    population: MUD_BASE_URL + '#population',
    hasBuilding: MUD_BASE_URL + '#hasBuilding',

    primaryTextContent: MUD_BASE_URL + '#primaryTextContent',
    primaryImageContent: MUD_BASE_URL + '#primaryImageContent',
}

export const MUD_CONTENT = {
    content: MUD_CONTENT_BASE_URL + "#content",
    sight: MUD_CONTENT_BASE_URL + "#sight",
}

export const MUD_LOGIC = {
    Transit: MUD_LOGIC_BASE_URL + "#Transit",
}

// TODO: https://github.com/calummackervoy/mud-react/issues/4
export const MUDAPI = {
    worldPath: 'mud/world/',
    contentPath: 'mud/content/',
    taskPath: 'mud/act/task/',
}