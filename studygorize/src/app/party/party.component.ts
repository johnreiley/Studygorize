import { Component, OnDestroy, OnInit } from '@angular/core';
import { PartyConfig } from '../shared/models/party-models/partyConfig.model';
import { PartyState } from '../shared/models/party-models/partyState.model';
import { PartyUser } from '../shared/models/party-models/partyUser.model';
import { Topic } from '../shared/models/topic.model';
import { LoadingService } from '../shared/services/loading.service';
import { PartyService } from '../shared/services/party.service';
import { TestService } from '../shared/services/test.service';
import { TopicService } from '../shared/services/topic.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.scss']
})
export class PartyComponent implements OnInit, OnDestroy {
  partyId: string;
  partyState: PartyState;
  users: PartyUser[] = [];
  topics: Topic[];
  private partyService: PartyService;

  constructor(private topicService: TopicService,
    private testService: TestService,
    private loadingService: LoadingService) { 
      this.partyService = new PartyService();
    }

  ngOnInit(): void {
    this.loadingService.startLoading();
    this.topicService.getTopics().subscribe((topics) => {
      this.topics = topics;
      this.loadingService.stopLoading();
    })

    this.partyService.userJoined.subscribe((user: PartyUser) => {
      this.users.push(user);
    })

    this.partyService.userLeft.subscribe((uuid: string) => {
      let user = this.users.find(u => u.uuid === uuid);
      let index = this.users.indexOf(user);
      if (index > -1) {
        this.users.splice(index, 1);
      }
    });
  }

  ngOnDestroy(): void {
    this.partyService.closeConnection();
  }

  public get PartyState() {
    return PartyState;
  }

  createParty(partyConfig: PartyConfig) {
    this.loadingService.startLoading();
    
    // generate the test here...

    if (this.partyId === undefined) {
      let subscription = this.partyService.partyCreated.subscribe((partyId) => {
        this.partyId = partyId;
        subscription.unsubscribe();
        this.partyState = PartyState.WaitingRoom;
        this.loadingService.stopLoading();
      });
      this.partyService.createParty();
    }
  }

}
