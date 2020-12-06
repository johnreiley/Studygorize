import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Test } from 'src/app/shared/models/test-models/test.model';
import { TestConfig } from 'src/app/shared/models/test-models/testConfig.model';
import { Topic } from 'src/app/shared/models/topic.model';
import { LoadingService } from 'src/app/shared/services/loading.service';
import { TestService } from 'src/app/shared/services/test.service';
import { TopicService } from 'src/app/shared/services/topic.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public test: Test;
  public testConfig: TestConfig;
  public currentQuestionIndex = 0;
  public topic: Topic;
  public isLast = false;
  public showResults = false;

  constructor(
    private testService: TestService,
    private topicService: TopicService,
    private router: Router,
    private route: ActivatedRoute,
    private loader: LoadingService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      if (params["id"]) {
        // get the topic
        this.topicService.getTopic(params["id"]).subscribe((topic) => {
          this.topic = topic;
          
          // create config
          this.testConfig = new TestConfig(false, 20, true, true);
          
          // generate the test
          this.test = this.testService.generateTest(this.testConfig, topic);
        });
      }
    });
  }

  onSubmit() {

  }

  onNext(button: HTMLButtonElement) {
    if (this.isLast) {
      // grade the test
      this.test = this.testService.gradeTest(this.test);

      // show the results
      this.showResults = true;
    } else {
      this.currentQuestionIndex++;
      if (this.currentQuestionIndex === this.test.questions.length - 1) {
        this.isLast = true;
      }
    }
    button.blur();
    window.scrollTo(0, 0);
  }

  onPrevious(button: HTMLButtonElement) {
    if (this.testConfig.allowPrevousNavigation && this.currentQuestionIndex > 0) {
      this.isLast = false;
      this.currentQuestionIndex--;
      window.scrollTo(0, 0);
      button.blur();
    }
  }

}