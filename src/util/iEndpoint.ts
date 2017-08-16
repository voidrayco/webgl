import { IChord, IEndpoint } from '../chord-chart/generators/types';

const RANDOM = require('random');
const ADJECTIVES = [ 'Good', 'New', 'First', 'Last', 'Long', 'Great', 'Little', 'Own', 'Other', 'Old', 'Right', 'Big', 'High', 'Different', 'Small', 'Large', 'Next', 'Early', 'Young', 'Important', 'Few', 'Public', 'Bad', 'Same', 'Able', 'Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome', 'Long', 'Magnificent', 'Old-fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Unsightly', 'Wide-eyed', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Gray', 'Black', 'White', 'Alive', 'Better', 'Careful', 'Clever', 'Dead', 'Easy', 'Famous', 'Gifted', 'Helpful', 'Important', 'Inexpensive', 'Mushy', 'Odd', 'Powerful', 'Rich', 'Shy', 'Tender', 'Uninterested', 'Vast', 'Wrong', 'Agreeable', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful', 'Gentle', 'Happy', 'Jolly', 'Kind', 'Lively', 'Nice', 'Obedient', 'Proud', 'Relieved', 'Silly', 'Thankful', 'Victorious', 'Witty', 'Zealous', 'Angry', 'Bewildered', 'Clumsy', 'Defeated', 'Embarrassed', 'Fierce', 'Grumpy', 'Helpless', 'Itchy', 'Jealous', 'Lazy', 'Mysterious', 'Nervous', 'Obnoxious', 'Panicky', 'Repulsive', 'Scary', 'Thoughtless', 'Uptight', 'Worried', 'Broad', 'Chubby', 'Crooked', 'Curved', 'Deep', 'Flat', 'High', 'Hollow', 'Low', 'Narrow', 'Round', 'Shallow', 'Skinny', 'Square', 'Steep', 'Straight', 'Wide', 'Big', 'Colossal', 'Fat', 'Gigantic', 'Great', 'Huge', 'Immense', 'Large', 'Little', 'Mammoth', 'Massive', 'Miniature', 'Petite', 'Puny', 'Scrawny', 'Short', 'Small', 'Tall', 'Teeny', 'Teeny-tiny', 'Tiny', 'Cooing', 'Deafening', 'Faint', 'Hissing', 'Loud', 'Melodic', 'Noisy', 'Purring', 'Quiet', 'Raspy', 'Screeching', 'Thundering', 'Voiceless', 'Whispering', 'Ancient', 'Brief', 'Early', 'Fast', 'Late', 'Long', 'Modern', 'Old', 'Old-fashioned', 'Quick', 'Rapid', 'Short', 'Slow', 'Swift', 'Young', 'Bitter', 'Delicious', 'Fresh', 'Greasy', 'Juicy', 'Hot', 'Icy', 'Loose', 'Melted', 'Nutritious', 'Prickly', 'Rainy', 'Rotten', 'Salty', 'Sticky', 'Strong', 'Sweet', 'Tart', 'Tasteless', 'Uneven', 'Weak', 'Wet', 'Wooden', 'Yummy', 'Boiling', 'Breeze', 'Broken', 'Bumpy', 'Chilly', 'Cold', 'Cool', 'Creepy', 'Crooked', 'Cuddly', 'Curly', 'Damaged', 'Damp', 'Dirty', 'Dry', 'Dusty', 'Filthy', 'Flaky', 'Fluffy', 'Freezing', 'Hot', 'Warm', 'Wet', 'Abundant', 'Empty', 'Few', 'Full', 'Heavy', 'Light', 'Many', 'Numerous', 'Sparse', 'Substantial' ];
const NOUNS = [ 'History', 'Way', 'Art', 'World', 'Information', 'Map', 'Family', 'Government', 'Health', 'System', 'Computer', 'Year', 'Music', 'Person', 'Reading', 'Method', 'Data', 'Food', 'Understanding', 'Theory', 'Law', 'Bird', 'Literature', 'Problem', 'Software', 'Control', 'Knowledge', 'Power', 'Ability', 'Economics', 'Internet', 'Television', 'Science', 'Library', 'Nature', 'Fact', 'Product', 'Idea', 'Temperature', 'Investment', 'Area', 'Society', 'Activity', 'Story', 'Industry', 'Media', 'Thing', 'Oven', 'Community', 'Definition', 'Safety', 'Quality', 'Development', 'Language', 'Management', 'Player', 'Variety', 'Video', 'Week', 'Security', 'Country', 'Exam', 'Movie', 'Organization', 'Equipment', 'Physics', 'Analysis', 'Policy', 'Series', 'Thought', 'Basis', 'Boyfriend', 'Direction', 'Strategy', 'Technology', 'Army', 'Camera', 'Freedom', 'Paper', 'Environment', 'Child', 'Instance', 'Month', 'Truth', 'Marketing', 'University', 'Writing', 'Article', 'Department', 'Difference', 'Goal', 'News', 'Audience', 'Fishing', 'Growth', 'Income', 'Marriage', 'User', 'Combination', 'Failure', 'Meaning', 'Medicine', 'Philosophy', 'Teacher', 'Communication', 'Night', 'Chemistry', 'Disease', 'Disk', 'Energy', 'Nation', 'Road', 'Role', 'Soup', 'Advertising', 'Location', 'Success', 'Addition', 'Apartment', 'Education', 'Math', 'Moment', 'Painting', 'Politics', 'Attention', 'Decision', 'Event', 'Property', 'Shopping', 'Student', 'Wood', 'Competition', 'Distribution', 'Entertainment', 'Office', 'Population', 'President', 'Unit', 'Category', 'Cigarette', 'Context', 'Introduction', 'Opportunity', 'Performance', 'Driver', 'Flight', 'Length', 'Magazine' ];
const MIN_ENDPOINT_WEIGHT = 5;
const MAX_ENDPOINT_WEIGHT = 100;
const adjectiveGenerator = RANDOM.item(ADJECTIVES);
const nounGenerator = RANDOM.item(NOUNS);

/**
 * Initializes endpoints from json data to have all properties of IEndpoint interface
 * Immutable
 *
 * @param {IEndpoint[]} endpoints - flat list of endpoints
 */
export function addPropertiesToEndpoints(endpoints: IEndpoint[]){
    const endpointObjs = endpoints.map(a => Object.assign({}, a));
    endpointObjs.forEach((endpoint) => {
        endpoint.children = [];
    });
    return endpointObjs;
}

/**
 * Calculates the outgoingCount, incomingCount, and totalCount quantities for passed in endpoints based on the passed in IFlows
 * Immutable
 *
 * @param {IEndpoint[]} endpoints - flat list of endpoints
 * @param {IEndpoint[]} flows - flat list of flows
 */
export function setEndpointFlowCounts(endpoints: IEndpoint[], flows: IChord[]){
    const endpointObjs = endpoints.map(a => Object.assign({}, a));
    endpointObjs.forEach((endpoint) => {
        const outgoingFlows = this.getFlowsByEndpoint(endpoint, flows, 'outgoing');
        const incomingFlows = this.getFlowsByEndpoint(endpoint, flows, 'incoming');
        endpoint.outgoingCount = outgoingFlows.length;
        endpoint.incomingCount = incomingFlows.length;
        endpoint.totalCount = outgoingFlows.length + incomingFlows.length;
    });
    return endpointObjs;
}

/**
 * Sets start angle to always be smallest angle and end angle to be greatest angle for each endpoint
 * Immutable
 *
 * @param {IEndpoint[]} endpoints - flat list of endpoints
 */
export function polarizeStartAndEndAngles(endpoints: IEndpoint[]){
    const endpointObjs = endpoints.map(a => Object.assign({}, a));
    endpointObjs.forEach((endpoint) => {
        const getTrueStartAngle = (startAngle: number, endAngle: number) => startAngle > endAngle ? endAngle : startAngle;
        const getTrueEndAngle = (startAngle: number, endAngle: number) => startAngle > endAngle ? startAngle : endAngle;
        const startAngle = getTrueStartAngle(endpoint.startAngle, endpoint.endAngle);
        const endAngle = getTrueEndAngle(endpoint.startAngle, endpoint.endAngle);
        endpoint.startAngle = startAngle;
        endpoint.endAngle = endAngle;
    });
    return endpointObjs;
}

/**
 * Returns array of flows associated with the passed in endpoint
 * Immutable
 *
 * @param {IEndpoint} endpoint
 * @param {IEndpoint[]} flows - flat list of flows
 * @param {string} type - 'outgoing' or 'incoming', or empty (both)
 */
export function getFlowsByEndpoint(endpoint: IEndpoint, flows: IChord[], type ? : string){
    return flows.filter((flow: IChord) => {
        if (type === 'outgoing' && flow.srcTarget === endpoint.id) return true;
        else if (type === 'incoming' && flow.dstTarget === endpoint.id) return true;
        else if (!type && (flow.srcTarget === endpoint.id || flow.dstTarget === endpoint.id)) return true;
        return false;
    });
}

/**
 * Removes all endpoints from selection that are smaller than the specified range
 * Immutable
 *
 * @param {IEndpoint[]} endpoints - flat list of endpoints
 * @param {number} minRange - minimum endAngle-startAngle size of endpoint
 */
export function filterEndpoints(endpoints: IEndpoint[], minRange: number) {
    return endpoints.filter((endpoint) =>
        Math.abs(endpoint.endAngle - endpoint.startAngle) > minRange);
}

/**
 * Creates random endpoint that assumes subspace of passed in endpoint
 * Immutable
 *
 * @param {IEndpoint} boundsEndpoint - endpoint that is used as bounds for creating new endpoint
 */
export function createEndpoint(sibling: IEndpoint){
    // Const endAngle = boundsEndpoint.endAngle;
    // Const startAngle = boundsEndpoint.startAngle;
    const getRandomWeight = RANDOM.float(MIN_ENDPOINT_WEIGHT, MAX_ENDPOINT_WEIGHT);
    const randomWeight = getRandomWeight();
    const id = adjectiveGenerator() + nounGenerator();
    const name = id;
    const newEndpoint = {
        endAngle: 0,
        id,
        incomingCount: 0,
        name,
        outgoingCount: 0,
        parent: sibling.parent,
        startAngle: 0,
        totalCount: 0,
        weight: randomWeight,
    };
    return newEndpoint;
}
