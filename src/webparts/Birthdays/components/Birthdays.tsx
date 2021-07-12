import * as React from 'react';
import { SPHttpClient, SPHttpClientResponse,IHttpClientOptions, SPHttpClientConfiguration,IDigestCache, DigestCache } from '@microsoft/sp-http';
import styles from './Birthdays.module.scss';
import { IBirthdaysProps } from './IBirthdaysProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { HappyBirthday, IUser } from '../../../controls/happybirthday';
import * as moment from 'moment';
import { IBirthdayState } from './IBirthdaysState';
import SPService from '../../../services/SPService';
import { WebPartTitle } from "@pnp/spfx-controls-react/lib/WebPartTitle";
const imgBackgroundBallons: string = require('../../../../assets/ballonsBackgroud.png');
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as strings from 'ControlStrings';

export default class Birthdays extends React.Component<IBirthdaysProps, IBirthdayState> {
  private _users: IUser[] = [];
  private _spServices: SPService;
  constructor(props: IBirthdaysProps) {
    super(props);
    this._spServices = new SPService(this.props.context);
    this.state = {
      Users: [],
      showBirthdays: true
    };
  }

  public componentDidMount(): void {
    this.GetUsers();
  }

  public componentDidUpdate(prevProps: IBirthdaysProps, prevState: IBirthdayState): void {

  }
  // Render
  public render(): React.ReactElement<IBirthdaysProps> {
    let _center: any = !this.state.showBirthdays ? "center" : "";
    return (
      <div className={styles.happyBirthday}
        style={{ textAlign: _center }} >
        <div className={styles.container}>
          {/* <WebPartTitle displayMode={this.props.displayMode}
            title={this.props.title}
            updateProperty={this.props.updateProperty} /> */}
          {
            !this.state.showBirthdays ?
              <div className={styles.backgroundImgBallons}>
                <Image imageFit={ImageFit.cover}
                  src={imgBackgroundBallons}
                  width={150}
                  height={150}
                />
                <Label className={styles.subTitle}>{strings.MessageNoBirthdays}</Label>
              </div>
              :
              <HappyBirthday users={this.state.Users} imageTemplate={this.props.imageTemplate}
              />
          }
        </div>
      </div>
    );
  }

  // Sort Array of Birthdays
  private SortBirthdays(users: IUser[]) {
    return users.sort( (a, b) => {
      if (a.AnniversaryDate > b.AnniversaryDate) {
        return 1;
      }
      if (a.AnniversaryDate < b.AnniversaryDate) {
        return -1;
      }
      return 0;
    });
  }

  // Load List Of Users
  private async GetUsers() {
    this.getPBirthdays(this.props.numberUpcomingDays).then((response)=>{
      console.log("this is my arry of birthday",response.value);
      this.ListData(response.value);
     
    });
  }

  private ListData(listItems): void{  
    let _otherMonthsBirthdays: IUser[], _dezemberBirthdays: IUser[];
   console.log("List is empty",listItems);
   if (listItems !=null && listItems.length > 0) {
      for (var item of listItems) {
        this._users.push({  AnniversaryUser: item.AnniversaryUser, UserJobTitle: item.UserJobTitle, AnniversaryDate: item.Anniversary, ID:item.ID });
      }
     
      // Sort Items by Birthday MSGraph List Items API don't support ODATA orderBy
      // for end of year teste and sorting
      //  first select all bithdays of Dezember to sort this must be the first to show
      if (moment().format('MM') === '12') {
        // _dezemberBirthdays = this._users.filter( (v) => {
        //   var _currentMonth = moment(v.AnniversaryDate, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('MM');
        //   return (_currentMonth === '12');
        // });
        // // Sort by birthday date in Dezember month
        // _dezemberBirthdays = this.SortBirthdays(_dezemberBirthdays);
        // // select birthdays != of month 12
        // _otherMonthsBirthdays = this._users.filter((v) => {
        //   var _currentMonth = moment(v.AnniversaryDate, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('MM');
        //   return (_currentMonth !== '12');
        // });
        // // sort by birthday date
        // _otherMonthsBirthdays = this.SortBirthdays(_otherMonthsBirthdays);
        // // Join the 2 arrays
        // this._users = _dezemberBirthdays.concat(_otherMonthsBirthdays);
      }
      else {
        //this._users = this.SortBirthdays(this._users);
      }
    }
    console.log("my list data arry",this._users);
    this.setState(
      {
        Users: this._users,
        showBirthdays: this._users.length == 0 ? false : true
      });
  }

  public getPBirthdays(upcommingDays: number): Promise<any> {
    let _results, _today: string, _month: string, _day: number;
    let _filter: string, _countdays: number, _f:number, _nextYearStart: string;
    let  _FinalDate: string;

    let currentDate = moment();
    currentDate.add(1,'days');
    console.log(currentDate);
    let weekStart = currentDate.clone().startOf('month');
    let weekEnd = currentDate.clone().endOf('month');
    let new_date1 = moment(weekEnd, "DD-MM-YYYY").add(2, 'days');

    let formattedStart = weekStart.format('YYYY-MM-DD');
    let formattedEnd = weekEnd.format('YYYY-MM-DD');
    

    // var todaydate=new Date();
    // //var curr = new Date(); // get current date
    // var first = todaydate.getDate() - todaydate.getDay(); // First day is the day of the month - the day of the week
    // var last = first + 7; // last day is the first day + 6
    // var firstday = new Date(todaydate.setDate(first)).toISOString();
    // var lastday = new Date(todaydate.setDate(last)).toISOString();
    // //var test=todaydate.toISOString();
    // //var check=test.split("T");
    // var firstdate = firstday.split("T");
    // var lastdate = lastday.split("T");
    // let getdatavalfirst = firstdate[0].trim();
    // let getdatavallast = lastdate[0].trim();
    let getdatavaluefirst: string[] = formattedStart.split("-");
    let getdatavaluelast: string[] = formattedEnd.split("-");
    var FristDateCompare = "1940" + '-' + getdatavaluefirst[1] + '-' + getdatavaluefirst[2]
    var LastDateCompare = "1940" + '-' + getdatavaluelast[1] + '-' + getdatavaluelast[2]
    //console.log(check[0])
    try {
      _results = null;
      _today = '2000-' + moment().format('MM-DD');
      _month = moment().format('MM');
      _day = parseInt(moment().format('DD'));
      _filter = "fields/Birthday ge '" + _today + "'";
      // If we are in Dezember we have to look if there are birthday in January
      // we have to build a condition to select birthday in January based on number of upcommingDays
      // we can not use the year for teste , the year is always 2000.
      if (_month === '12') {
        _countdays = _day + upcommingDays;
        _f = 0;
        _nextYearStart = '2000-01-01';
        _FinalDate = '2000-01-';
        if ((_countdays) > 31) {
          _f = _countdays - 31;
          _FinalDate = _FinalDate + _f;
          _filter = "fields/Birthday ge '" + _today + "' or (fields/Birthday ge '" + _nextYearStart + "' and fields/Birthday le '" + _FinalDate + "')";
        }
      }
       let url:string=`${this.props.siteurl}/_api/web/lists/getbytitle('Anniversary')/items?$select=*,AnniversaryUser/EMail,AnniversaryUser/Id,AnniversaryUser/Title&$expand=AnniversaryUser&$filter=((AnniversaryHidden ge datetime'`+FristDateCompare+"T00:00:00.0000Z"+`') and (AnniversaryHidden le datetime'`+LastDateCompare+"T00:00:00.0000Z"+`') )&$orderby=AnniversaryHidden asc`;
       console.log("url",url)
       return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1).then((response: SPHttpClientResponse)=>{  
        return response.json();  
     });  

    } catch (error) {
      console.dir(error);
      return Promise.reject(error);
    }
  
  }
}
