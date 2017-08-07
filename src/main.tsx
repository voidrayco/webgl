import { rgb } from 'd3-color';
import { hsl } from 'd3-color';
import { difference, union } from 'ramda';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Bezier } from './bezier';
import { IQuadShapeData } from './bezier/shape-data-types/quad-shape-data';
import { ChordChart } from './chord-chart';
import { IData as IChordData, IEndpoint, IFlow } from './chord-chart/generators/types';

const testChordData = require('./chord-chart/test-data/chord-data.json');
// Assign unique id to all flows for uniqueness
// Const mapIndexed = addIndex(map);
// MapIndexed((val, idx) => val.id = idx, testChordData.flows);

const RANDOM = require('random');

/**
 * The state of the application
 */
interface IMainState {
  currentTab: number,
  visibleFlows: IFlow[];
  visibleEndpoints: IEndpoint[];
}

interface IHemisphere {
  endAngle: number,
  name: string;
  startAngle: number;
}

/**
 * Entry class for the Application
 */
export class Main extends React.Component<any, IMainState> {
  CHORD_CHANGE_QTY = 5;
  ADJECTIVES = [ 'Good', 'New', 'First', 'Last', 'Long', 'Great', 'Little', 'Own', 'Other', 'Old', 'Right', 'Big', 'High', 'Different', 'Small', 'Large', 'Next', 'Early', 'Young', 'Important', 'Few', 'Public', 'Bad', 'Same', 'Able', 'Adorable', 'Beautiful', 'Clean', 'Drab', 'Elegant', 'Fancy', 'Glamorous', 'Handsome', 'Long', 'Magnificent', 'Old-fashioned', 'Plain', 'Quaint', 'Sparkling', 'Ugliest', 'Unsightly', 'Wide-eyed', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple', 'Gray', 'Black', 'White', 'Alive', 'Better', 'Careful', 'Clever', 'Dead', 'Easy', 'Famous', 'Gifted', 'Helpful', 'Important', 'Inexpensive', 'Mushy', 'Odd', 'Powerful', 'Rich', 'Shy', 'Tender', 'Uninterested', 'Vast', 'Wrong', 'Agreeable', 'Brave', 'Calm', 'Delightful', 'Eager', 'Faithful', 'Gentle', 'Happy', 'Jolly', 'Kind', 'Lively', 'Nice', 'Obedient', 'Proud', 'Relieved', 'Silly', 'Thankful', 'Victorious', 'Witty', 'Zealous', 'Angry', 'Bewildered', 'Clumsy', 'Defeated', 'Embarrassed', 'Fierce', 'Grumpy', 'Helpless', 'Itchy', 'Jealous', 'Lazy', 'Mysterious', 'Nervous', 'Obnoxious', 'Panicky', 'Repulsive', 'Scary', 'Thoughtless', 'Uptight', 'Worried', 'Broad', 'Chubby', 'Crooked', 'Curved', 'Deep', 'Flat', 'High', 'Hollow', 'Low', 'Narrow', 'Round', 'Shallow', 'Skinny', 'Square', 'Steep', 'Straight', 'Wide', 'Big', 'Colossal', 'Fat', 'Gigantic', 'Great', 'Huge', 'Immense', 'Large', 'Little', 'Mammoth', 'Massive', 'Miniature', 'Petite', 'Puny', 'Scrawny', 'Short', 'Small', 'Tall', 'Teeny', 'Teeny-tiny', 'Tiny', 'Cooing', 'Deafening', 'Faint', 'Hissing', 'Loud', 'Melodic', 'Noisy', 'Purring', 'Quiet', 'Raspy', 'Screeching', 'Thundering', 'Voiceless', 'Whispering', 'Ancient', 'Brief', 'Early', 'Fast', 'Late', 'Long', 'Modern', 'Old', 'Old-fashioned', 'Quick', 'Rapid', 'Short', 'Slow', 'Swift', 'Young', 'Bitter', 'Delicious', 'Fresh', 'Greasy', 'Juicy', 'Hot', 'Icy', 'Loose', 'Melted', 'Nutritious', 'Prickly', 'Rainy', 'Rotten', 'Salty', 'Sticky', 'Strong', 'Sweet', 'Tart', 'Tasteless', 'Uneven', 'Weak', 'Wet', 'Wooden', 'Yummy', 'Boiling', 'Breeze', 'Broken', 'Bumpy', 'Chilly', 'Cold', 'Cool', 'Creepy', 'Crooked', 'Cuddly', 'Curly', 'Damaged', 'Damp', 'Dirty', 'Dry', 'Dusty', 'Filthy', 'Flaky', 'Fluffy', 'Freezing', 'Hot', 'Warm', 'Wet', 'Abundant', 'Empty', 'Few', 'Full', 'Heavy', 'Light', 'Many', 'Numerous', 'Sparse', 'Substantial' ];
  NOUNS = [ 'History', 'Way', 'Art', 'World', 'Information', 'Map', 'Family', 'Government', 'Health', 'System', 'Computer', 'Year', 'Music', 'Person', 'Reading', 'Method', 'Data', 'Food', 'Understanding', 'Theory', 'Law', 'Bird', 'Literature', 'Problem', 'Software', 'Control', 'Knowledge', 'Power', 'Ability', 'Economics', 'Internet', 'Television', 'Science', 'Library', 'Nature', 'Fact', 'Product', 'Idea', 'Temperature', 'Investment', 'Area', 'Society', 'Activity', 'Story', 'Industry', 'Media', 'Thing', 'Oven', 'Community', 'Definition', 'Safety', 'Quality', 'Development', 'Language', 'Management', 'Player', 'Variety', 'Video', 'Week', 'Security', 'Country', 'Exam', 'Movie', 'Organization', 'Equipment', 'Physics', 'Analysis', 'Policy', 'Series', 'Thought', 'Basis', 'Boyfriend', 'Direction', 'Strategy', 'Technology', 'Army', 'Camera', 'Freedom', 'Paper', 'Environment', 'Child', 'Instance', 'Month', 'Truth', 'Marketing', 'University', 'Writing', 'Article', 'Department', 'Difference', 'Goal', 'News', 'Audience', 'Fishing', 'Growth', 'Income', 'Marriage', 'User', 'Combination', 'Failure', 'Meaning', 'Medicine', 'Philosophy', 'Teacher', 'Communication', 'Night', 'Chemistry', 'Disease', 'Disk', 'Energy', 'Nation', 'Road', 'Role', 'Soup', 'Advertising', 'Location', 'Success', 'Addition', 'Apartment', 'Education', 'Math', 'Moment', 'Painting', 'Politics', 'Attention', 'Decision', 'Event', 'Property', 'Shopping', 'Student', 'Wood', 'Competition', 'Distribution', 'Entertainment', 'Office', 'Population', 'President', 'Unit', 'Category', 'Cigarette', 'Context', 'Introduction', 'Opportunity', 'Performance', 'Driver', 'Flight', 'Length', 'Magazine' ];

  constructor(props: IMainState){
    super(props);
    this.state = {
      currentTab: 0,
      visibleEndpoints: this.buildInitialEndpoints(testChordData.endpoints),
      visibleFlows: this.buildInitialFlows(testChordData.flows),
    };
  }

  buildInitialEndpoints(endpoints: IEndpoint[]){
    return endpoints;
  }

  buildInitialFlows(flows: IFlow[]){
    return flows;
  }

  /**
   * Returns array of flows that have the src or dst endpoint passed in
   *
   * @param {IEndpoint} endpoint
   * @param {string} type - 'outgoing' or 'incoming'
   */
  getFlowsByEndpoint(endpoint: IEndpoint, type: string){
    return this.state.visibleFlows.filter((flow: IFlow) => {
      if ((type === 'outgoing' && flow.srcTarget === endpoint.id) ||
        (type === 'incoming' && flow.dstTarget === endpoint.id)){
        return true;
      }
      return false;
    });
  }

  generateFlow = () => {
    const getRandomEndpoint = RANDOM.item(this.state.visibleEndpoints);
    const src: IEndpoint = getRandomEndpoint();
    let dst: IEndpoint = getRandomEndpoint();
    while (dst.id === src.id) dst = getRandomEndpoint();
    const color = hsl(this.getHslRandomHVal(), 1, this.getHslRandomLVal());
    const incomingFlows = this.getFlowsByEndpoint(dst, 'incoming');
    const outgoingFlows = this.getFlowsByEndpoint(src, 'outgoing');
    return {
      baseColor: color,
      destExpandedTarget: '',  // Future TODO
      dstIndex: incomingFlows.length ? incomingFlows.length + 1 : 1,
      dstTarget: dst.id,
      srcExpandedTarget: '',  // Future TODO
      srcIndex: outgoingFlows.length ? outgoingFlows.length + 1 : 1,
      srcTarget: src.id,
    };
  }

  MINIMUM_ENDPOINT_SIZE = 0.5; // Radians
  ROTATION = -Math.PI / 2;
  HEMISPHERE_1: IHemisphere = {
    endAngle: Math.PI + this.ROTATION,
    name: 'remote',
    startAngle: this.ROTATION,
  };
  HEMISPHERE_2: IHemisphere = {
    endAngle: (2 * Math.PI) + this.ROTATION,
    name: 'topology',
    startAngle: (Math.PI) + this.ROTATION,
  };
  adjectiveGenerator = RANDOM.item(this.ADJECTIVES);
  nounGenerator = RANDOM.item(this.NOUNS);
  hemisphereGenerator = RANDOM.item([this.HEMISPHERE_1, this.HEMISPHERE_2]);

  getHemisphereEndpoints = (hemisphere: string, endpoints: IEndpoint[]) => {
    const hemisphereEndpoints = endpoints.filter((endpoint) => endpoint.placement === hemisphere);
    return hemisphereEndpoints;
  }

  // Removes all endpoints from selection that are smaller than the specified range
  filterEndpoints(endpoints: IEndpoint[], minRange: number){
    return endpoints.filter((endpoint) =>
      Math.abs(endpoint.endAngle - endpoint.startAngle) > minRange);
  }

  injectEndpoint = (endpoints: IEndpoint[]) => {
    // Find endpoint to break into two--------
    let hemisphere = this.hemisphereGenerator();
    let hemisphereEndpoints = this.getHemisphereEndpoints(hemisphere.name, endpoints);
    let filteredEndpoints = this.filterEndpoints(hemisphereEndpoints, this.MINIMUM_ENDPOINT_SIZE);
    if (filteredEndpoints.length < 1){
      // Switch hemisphere
      hemisphere = hemisphere === this.HEMISPHERE_1 ? this.HEMISPHERE_2 : this.HEMISPHERE_1;
      hemisphereEndpoints = this.getHemisphereEndpoints(hemisphere.name, endpoints);
      filteredEndpoints = this.filterEndpoints(hemisphereEndpoints, this.MINIMUM_ENDPOINT_SIZE);
      if (filteredEndpoints.length < 1) return endpoints; // Don't change anything if no splitable endpoint
    }

    // Break endpoint into two and inject new endpoint into one side (currently start side only)
    const getRandomEndpoint = RANDOM.item(filteredEndpoints);
    const randomEndpoint = getRandomEndpoint();
    const getTrueStartAngle = (startAngle: number, endAngle: number) => startAngle > endAngle ? endAngle : startAngle;
    const getTrueEndAngle = (startAngle: number, endAngle: number) => startAngle > endAngle ? startAngle : endAngle;
    const startAngle = getTrueStartAngle(randomEndpoint.startAngle, randomEndpoint.endAngle);
    const endAngle = getTrueEndAngle(randomEndpoint.startAngle, randomEndpoint.endAngle);
    const getRandomStartAngleInsideEndpoint = RANDOM.float(startAngle, endAngle);
    const randomStartAngle = getRandomStartAngleInsideEndpoint();
    const name = this.adjectiveGenerator() + this.nounGenerator();
    const newEndpoint = {
      endAngle: randomEndpoint.endAngle,
      flowAngles: {
        angleStep: 0,
        startAngle: randomStartAngle,
      },
      id: name,
      incomingCount: 0,
      name,
      outgoingCount: 0,
      placement: hemisphere.name,
      startAngle: randomStartAngle,
      totalCount: 0,
    };
    randomEndpoint.endAngle = randomStartAngle; // Not pure function
    return union(endpoints, [newEndpoint]);
  }

  removeEndpoint = (endpoints: IEndpoint[], flows: IFlow[]) => {
    // Find usable hemisphere for endpoint removal
    let hemisphere = this.hemisphereGenerator();
    let hemisphereEndpoints = this.getHemisphereEndpoints(hemisphere.name, endpoints);
    if (hemisphereEndpoints.length < 2) {
      // Switch hemisphere
      hemisphere = hemisphere === this.HEMISPHERE_1 ? this.HEMISPHERE_2 : this.HEMISPHERE_1;
      hemisphereEndpoints = this.getHemisphereEndpoints(hemisphere.name, endpoints);
      if (hemisphereEndpoints.length < 2) return {endpoints, flows};  // Don't change anything if no usable hemisphere
    }

    // Remove endpoint--------------
    const randomRemoveEndpoint = RANDOM.item(hemisphereEndpoints);
    const removedEndpoint: IEndpoint = randomRemoveEndpoint();
    const newEndpoints = difference(endpoints, [removedEndpoint]);

    // Remove associated flows-------------
    const newFlows = flows.filter((flow) =>
      (removedEndpoint.id !== flow.srcTarget && removedEndpoint.id !== flow.dstTarget));

    // Adjust adjacent endpoint to fill in removed endpoint slice-------------
    const startAngle = removedEndpoint.startAngle, endAngle = removedEndpoint.endAngle;
    const trueStartAngle = startAngle > endAngle ? endAngle : startAngle;
    const isFirstEndpointInHemisphere =  (trueStartAngle > hemisphere.startAngle) ? false : true;
    const adjacentEndpoint = hemisphereEndpoints.find((endpoint) =>
      isFirstEndpointInHemisphere ? endpoint.startAngle === removedEndpoint.endAngle : endpoint.endAngle === removedEndpoint.startAngle);
    isFirstEndpointInHemisphere ? adjacentEndpoint.startAngle = removedEndpoint.startAngle :
      adjacentEndpoint.endAngle = removedEndpoint.endAngle;

    return {endpoints: newEndpoints, flows: newFlows};
  }

  getHslRandomHVal = RANDOM.float(193, 206);
  getHslRandomLVal = RANDOM.float(0.29, 0.54);

  /**
   * Generates a handler to set the current tab index
   *
   * @param {number} tab
   */
  handleClickTab = (tab: number) => () => this.setState({currentTab: tab});

  getEndpointIndex = (endpoints: IEndpoint[], id: string) => endpoints.findIndex((endpoint: IEndpoint) => endpoint.id === id);

  /**
   * Updates endpoint data to account for added or removed flow
   *
   * @param {IFlow} flow - flow that is being added or removed
   * @param {IEndpoint[]} endpoints - graph endpoint set
   * @param {boolean} isAdd - true means flow is being added, false means flow is being removed
   */
  updateRelatedEndpoints = (flow: IFlow, endpoints: IEndpoint[], isAdd: boolean) => {
    const srcEndpointIdx = this.getEndpointIndex(endpoints, flow.srcTarget);
    const srcEndpoint = endpoints[srcEndpointIdx];
    const dstEndpointIdx = this.getEndpointIndex(endpoints, flow.dstTarget);
    const dstEndpoint = endpoints[dstEndpointIdx];
    const delta = isAdd ? 1 : -1;
    srcEndpoint.outgoingCount += delta;
    srcEndpoint.totalCount += delta;
    dstEndpoint.incomingCount += delta;
    dstEndpoint.totalCount += delta;
    return endpoints;
  }

  removeFlowFromEndpoints = (flow: IFlow, endpoints: IEndpoint[]) =>
    this.updateRelatedEndpoints(flow, endpoints, false)

  addFlowToEndpoints = (flow: IFlow, endpoints: IEndpoint[]) =>
    this.updateRelatedEndpoints(flow, endpoints, true)

  addChords = () => {
    const newFlows: IFlow[] = [];
    let endpoints = this.state.visibleEndpoints;  // Deep copy to prevent artifacts?
    for (let a = 0; a < this.CHORD_CHANGE_QTY; a++){
      const flow: IFlow = this.generateFlow();
      newFlows.push(flow);
      endpoints = this.addFlowToEndpoints(flow, endpoints);
    }
    const visibleFlows = union(this.state.visibleFlows, newFlows);
    this.setState({visibleFlows, visibleEndpoints: endpoints});
  }

  removeChords = () => {
    const flows = this.state.visibleFlows;
    let endpoints = this.state.visibleEndpoints; // Deep copy to prevent artifacts?
    const removeQty = flows.length < this.CHORD_CHANGE_QTY ? flows.length : this.CHORD_CHANGE_QTY;
    const randomRemoveFlow = RANDOM.array(removeQty, RANDOM.item(flows));
    const removedFlows: IFlow[] = randomRemoveFlow();
    const visibleFlows = difference(flows, removedFlows);
    removedFlows.forEach((flow) => {
      endpoints = this.removeFlowFromEndpoints(flow, endpoints);
    });
    this.setState({visibleFlows, visibleEndpoints: endpoints});
  }

  updateChords = (type: string) => () => {
    if (type === '+') this.addChords();
    else this.removeChords();
  }

  /**
   * Local method that updates page's internal react state for endpoint interactions
   *
   * @param {string} type - 'add' or 'remove' endpoint
   */
  updateEndpoints = (type: string) => () => {
    // Const hemisphere = this.hemisphereGenerator();
    if (type === '+'){
      const visibleEndpoints = this.injectEndpoint(this.state.visibleEndpoints);
      // Const visibleEndpoints = union(this.state.visibleEndpoints, hemisphereEndpoints);
      this.setState({visibleEndpoints});
    }else if (this.state.visibleEndpoints.length > 0){
      const newData = this.removeEndpoint(this.state.visibleEndpoints, this.state.visibleFlows);
      if (newData){
        this.setState({visibleEndpoints: newData.endpoints, visibleFlows: newData.flows});
      }
    }
  }

  /**
   * @override
   * The React defined render method
   */
  render(){
    let quadData: IQuadShapeData[] = [];
    const chordData: IChordData = Object.assign([], testChordData);
    let component;
    let hasHemiSphere: boolean = false;

    if (this.state.currentTab === 0) {
      quadData = [...new Array(200)].map((_, i: number) =>
        ({
          color: rgb(1, 1, 1, 1),
          id: i,
          lineWidth: 1,
          p1: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
          p2: {x: Math.random() * 480 + 10, y: Math.random() * 480 + 10},
        }),
      );

      component = (
        <Bezier quadData={quadData}/>
      );
    }

    if (this.state.currentTab === 1) {
      hasHemiSphere = false;
      chordData.flows = this.state.visibleFlows;
      chordData.endpoints = this.state.visibleEndpoints;

      component = (
        <ChordChart hemiSphere={hasHemiSphere} testChordData={chordData}/>
      );
    }

    if (this.state.currentTab === 2){
      hasHemiSphere = true;
      chordData.flows = this.state.visibleFlows;
      chordData.endpoints = this.state.visibleEndpoints;

      component = (
        <ChordChart hemiSphere={hasHemiSphere} testChordData={chordData} />
      );
    }

    return (
      <div>
        <button onClick={this.handleClickTab(0)}>View Quads</button>
        <button onClick={this.handleClickTab(1)}>View Chord Demo</button>
        <button onClick={this.handleClickTab(2)}>HemiSphere</button>
        <span>Endpoint</span>
        <button onClick={this.updateEndpoints('+')}>+</button>
        <button onClick={this.updateEndpoints('-')}>-</button>
        <span>Chord</span>
        <button onClick={this.updateChords('+')}>+</button>
        <button onClick={this.updateChords('-')}>-</button>
        {component}
      </div>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('main'));
