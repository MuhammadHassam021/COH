import * as React from 'react';
import styles from './HappyBirthday.module.scss';
import { IHappyBirthdayProps } from './IHappyBirthdayProps';
import { IHappbirthdayState } from './IHappybirthdayState';
import { escape } from '@microsoft/sp-lodash-subset';
import { IUser } from './IUser';
import HappyBirdthayCard from '../../controls/happyBirthdayCard/HappyBirthdayCard';
import * as moment from 'moment';
import { Image, IImageProps, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Label } from 'office-ui-fabric-react/lib/Label';
import * as strings from 'ControlStrings';

export class HappyBirthday extends React.Component<IHappyBirthdayProps, IHappbirthdayState> {

  private _showBirthdays: boolean = true;
  constructor(props: IHappyBirthdayProps) {
    super(props);
    console.log(props.imageTemplate);
  }

  public async componentDidMount() {
  }

  public componentDidUpdate(prevProps: IHappyBirthdayProps, prevState: IHappbirthdayState): void {
  }

  //
  public render(): React.ReactElement<IHappyBirthdayProps> {
    return (
      <div className={styles.happyBirthday}>
        {
          this.props.users.map((user: IUser) => {
            console.log("user.AnniversaryDate", user.AnniversaryDate);
            var AnniversaryDate =  user.AnniversaryDate;
            var TodayDate =  new Date().toISOString();
            let date1 = new Date(user.AnniversaryDate.toString());
            let date2 = new Date();
            let yearsDiff =  date2.getFullYear() - date1.getFullYear();
            return (
              <div className={styles.container}>
                <HappyBirdthayCard userName={user.AnniversaryUser.Title}
                  jobDescription={user.UserJobTitle}
                  birthday={moment(user.AnniversaryDate, ["MM-DD-YYYY", "YYYY-MM-DD", "DD/MM/YYYY", "MM/DD/YYYY"]).format('Do MMMM').toString()}
                  years={yearsDiff + " years" }
                  userEmail={user.AnniversaryUser.EMail}
                  imageTemplate={this.props.imageTemplate}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}
export default HappyBirthday;

//mageTemplate={this.props.imageTemplate}
