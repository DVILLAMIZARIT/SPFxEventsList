import * as React from 'react';
import { IEventsListProps } from './IEventsListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp from 'sp-pnp-js';
import * as moment from 'moment';
import ReactCSSTransitionGroup  from 'react-addons-css-transition-group';
require('./styles.css');
import {IEvent} from './Interfaces/Event';
export default class EventsList extends React.Component<IEventsListProps, any> {

  constructor(props) {
    super(props);
    moment.locale('es');
    this.state = {
      events: [],
      top: 3
    }
  }

  async componentDidMount() {
    
    this.getDataFromList(this.props.list);
    
  }

  async componentWillReceiveProps(newProps) {

    this.getDataFromList(newProps.list);
    
  }

  async getDataFromList (ListName = 'test') {
    let {top} = this.state;
    
    let data = await pnp.sp.web.lists.getByTitle(ListName).items.orderBy("Date", false).top(top).get().catch(() => {return []});
    let events = this.processData(data);
    
    this.setState({
      events
    })
  }

  private processData (items) {
      let Events: Array<IEvent> = new Array<IEvent>(); 

      items.forEach(item => {
        console.log(item);
        let dateCalendar = moment(item.Date).format('L');
        let month = moment(item.Date).format('MMM');
        let day = dateCalendar.split('/')[0];

        let event: IEvent = {
          Title: item.Title,
          Day: parseInt(day),
          Description: item.Description,
          Month: month
        }
        Events.push(event);

      });
      
      return Events;

  }

  public render(): React.ReactElement<IEventsListProps> {

    let {events} = this.state;

    if(events.length === 0){
      return <div>No hay eventos en esta lista, o no existe</div>
    }

    return ( 
      
      <div className="container">
        <div className="row">
          <div className="col-md-12">
              
                <div className="panel panel-danger">
                      <div className="panel-heading">
                          <h3 className="panel-title">
                              <span className="glyphicon glyphicon-calendar"></span> 
                              Calendar Events
                          </h3>
                      </div>
                      <div className="panel-body">
                          <ul className="media-list">
                              {/* iterate over list of events */}
                            
                              {events && events.map( event => (
                                <li className="media item">
                                  <div className="media-left">
                                      <div className="panel panel-danger text-center date">
                                          <div className="panel-heading month">
                                              <span className="panel-title strong">
                                                  {event.Month}
                                              </span>
                                          </div>
                                          <div className="panel-body day text-danger">
                                              {event.Day}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="media-body">
                                      <h4 className="media-heading">
                                          {event.Title}
                                      </h4>
                                      <p>
                                          {event.Description}
                                      </p>
                                  </div>
                              </li>
                              ))}
          

                          </ul>
                          <button onClick={this._handleClickShowMore} className="btn btn-default btn-block">More Events »</button>
                      </div>
                  </div>            
              </div>
            </div>
          </div>
    );
  }


  _handleClickShowMore = (e) =>{
    console.log(this.state);console.log(this.props);
    this.setState({
      top: this.state.top + this.props.showMore
    }, () =>{
      this.getDataFromList(this.props.list);
    })
  }
}
