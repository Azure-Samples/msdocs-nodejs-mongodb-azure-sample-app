import { Component } from '/ai/cms/component.js'

export class tweet extends Component {
 static html = `
<style>
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu5mxP.ttf) format('truetype');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 700;
  src: url(https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfABc9.ttf) format('truetype');
}
.tw-block-parent {
  width: 500px;
  font: 14px/1.4 Roboto, Helvetica, Arial, Tahoma, sans-serif;
  font-weight: 300;
  color: #292F33;
}
.Avatar {
  width: 32px;
  height: 32px;
  background: url('data:image/png;base64,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');
  background-size: 32px;
}
.timeline-TweetList-tweet {
  border-top: 1px solid rgba(15, 70, 100, 0.12);
}
.timeline-TweetList-tweet:first-of-type {
  border-top: none;
}
.timeline-Tweet {
  position: relative;
  padding: 10px;
}
.timeline-Tweet a,
.timeline-Tweet .link {
  color: #3b94d9;
  text-decoration: none;
  outline: 0;
}
.timeline-Tweet a:hover,
.timeline-Tweet .link:hover {
  color: #55acee;
}
.timeline-Tweet-brand {
  position: absolute;
  top: 10px;
  right: 10px;
}
.timeline-Tweet-author {
  position: relative;
  margin-bottom: 2px;
  padding-left: 40px;
}
.timeline-Tweet-text {
  margin-left: 40px;
  margin-bottom: 12px;
  word-wrap: break-word;
  font-size: 18px;
  line-height: 24px;
  font-weight: 300;
}
.timeline-Tweet-metadata {
  position: absolute;
  bottom: 12px;
  right: 10px;
}
.timeline-Tweet-actions {
  margin: 0 0 0 40px;
  padding: 0;
  list-style: none;
  border: none;
}
.timeline-Tweet-action {
  display: inline-block;
  font-size: 17px;
}
.timeline-Tweet-action + .timeline-Tweet-action {
  margin-left: 20px;
}
.timeline-Tweet-timestamp {
  font-size: 12px;
  line-height: 18px;
  color: #e1e8ed;
  transition: color 0.2s;
}
.timeline-Tweet:hover {
  background-color: rgba(160, 200, 220, 0.12);
}
.timeline-Tweet:hover .timeline-Tweet-brand .Icon {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MiA3MiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGg3MnY3MkgweiIvPjxwYXRoIGNsYXNzPSJpY29uIiBmaWxsPSIjNTVhY2VlIiBkPSJNNjguODEyIDE1LjE0Yy0yLjM0OCAxLjA0LTQuODcgMS43NDQtNy41MiAyLjA2IDIuNzA0LTEuNjIgNC43OC00LjE4NiA1Ljc1Ny03LjI0My0yLjUzIDEuNS01LjMzIDIuNTkyLTguMzE0IDMuMTc2QzU2LjM1IDEwLjU5IDUyLjk0OCA5IDQ5LjE4MiA5Yy03LjIzIDAtMTMuMDkyIDUuODYtMTMuMDkyIDEzLjA5MyAwIDEuMDI2LjExOCAyLjAyLjMzOCAyLjk4QzI1LjU0MyAyNC41MjcgMTUuOSAxOS4zMTggOS40NCAxMS4zOTZjLTEuMTI1IDEuOTM2LTEuNzcgNC4xODQtMS43NyA2LjU4IDAgNC41NDMgMi4zMTIgOC41NTIgNS44MjQgMTAuOS0yLjE0Ni0uMDctNC4xNjUtLjY1OC01LjkzLTEuNjQtLjAwMi4wNTYtLjAwMi4xMS0uMDAyLjE2MyAwIDYuMzQ1IDQuNTEzIDExLjYzOCAxMC41MDQgMTIuODQtMS4xLjI5OC0yLjI1Ni40NTctMy40NS40NTctLjg0NSAwLTEuNjY2LS4wNzgtMi40NjQtLjIzIDEuNjY3IDUuMiA2LjUgOC45ODUgMTIuMjMgOS4wOS00LjQ4MiAzLjUxLTEwLjEzIDUuNjA1LTE2LjI2IDUuNjA1LTEuMDU1IDAtMi4wOTYtLjA2LTMuMTIyLS4xODQgNS43OTQgMy43MTcgMTIuNjc2IDUuODgyIDIwLjA2NyA1Ljg4MiAyNC4wODMgMCAzNy4yNS0xOS45NSAzNy4yNS0zNy4yNSAwLS41NjUtLjAxMy0xLjEzMy0uMDM4LTEuNjkzIDIuNTU4LTEuODQ3IDQuNzc4LTQuMTUgNi41MzItNi43NzR6Ii8+PC9zdmc+');
}
.timeline-Tweet:hover .timeline-Tweet-action .Icon {
  opacity: 1;
}
.timeline-Tweet:hover .timeline-Tweet-timestamp {
  color: #667580;
}
.TweetAuthor {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: normal;
}
.TweetAuthor-link {
  font-weight: inherit;
  color: inherit;
  text-decoration: inherit;
}
.TweetAuthor-avatar {
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 4px;
}
.TweetAuthor-name {
  margin-top: 5px;
  font-size: 14px;
  font-weight: 700;
  line-height: 18px;
}
.TweetAuthor-screenName {
  margin-left: 5px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 300;
  color: #8899A6;
}
.Icon {
  display: inline-block;
  width: 1em;
  height: 1.25em;
  background-repeat: no-repeat;
  background-size: contain;
  vertical-align: text-bottom;
  opacity: 0.6;
  transition: opacity 0.2s, background-image 0.2s;
}
.Icon:hover {
  opacity: 1;
}
.Icon--twitter {
  opacity: 1;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MiA3MiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGg3MnY3MkgweiIvPjxwYXRoIGNsYXNzPSJpY29uIiBmaWxsPSIjZTFlOGVkIiBkPSJNNjguODEyIDE1LjE0Yy0yLjM0OCAxLjA0LTQuODcgMS43NDQtNy41MiAyLjA2IDIuNzA0LTEuNjIgNC43OC00LjE4NiA1Ljc1Ny03LjI0My0yLjUzIDEuNS01LjMzIDIuNTkyLTguMzE0IDMuMTc2QzU2LjM1IDEwLjU5IDUyLjk0OCA5IDQ5LjE4MiA5Yy03LjIzIDAtMTMuMDkyIDUuODYtMTMuMDkyIDEzLjA5MyAwIDEuMDI2LjExOCAyLjAyLjMzOCAyLjk4QzI1LjU0MyAyNC41MjcgMTUuOSAxOS4zMTggOS40NCAxMS4zOTZjLTEuMTI1IDEuOTM2LTEuNzcgNC4xODQtMS43NyA2LjU4IDAgNC41NDMgMi4zMTIgOC41NTIgNS44MjQgMTAuOS0yLjE0Ni0uMDctNC4xNjUtLjY1OC01LjkzLTEuNjQtLjAwMi4wNTYtLjAwMi4xMS0uMDAyLjE2MyAwIDYuMzQ1IDQuNTEzIDExLjYzOCAxMC41MDQgMTIuODQtMS4xLjI5OC0yLjI1Ni40NTctMy40NS40NTctLjg0NSAwLTEuNjY2LS4wNzgtMi40NjQtLjIzIDEuNjY3IDUuMiA2LjUgOC45ODUgMTIuMjMgOS4wOS00LjQ4MiAzLjUxLTEwLjEzIDUuNjA1LTE2LjI2IDUuNjA1LTEuMDU1IDAtMi4wOTYtLjA2LTMuMTIyLS4xODQgNS43OTQgMy43MTcgMTIuNjc2IDUuODgyIDIwLjA2NyA1Ljg4MiAyNC4wODMgMCAzNy4yNS0xOS45NSAzNy4yNS0zNy4yNSAwLS41NjUtLjAxMy0xLjEzMy0uMDM4LTEuNjkzIDIuNTU4LTEuODQ3IDQuNzc4LTQuMTUgNi41MzItNi43NzR6Ii8+PC9zdmc+');
}
.Icon--twitter:hover {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3MiA3MiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGg3MnY3MkgweiIvPjxwYXRoIGNsYXNzPSJpY29uIiBmaWxsPSIjNTVhY2VlIiBkPSJNNjguODEyIDE1LjE0Yy0yLjM0OCAxLjA0LTQuODcgMS43NDQtNy41MiAyLjA2IDIuNzA0LTEuNjIgNC43OC00LjE4NiA1Ljc1Ny03LjI0My0yLjUzIDEuNS01LjMzIDIuNTkyLTguMzE0IDMuMTc2QzU2LjM1IDEwLjU5IDUyLjk0OCA5IDQ5LjE4MiA5Yy03LjIzIDAtMTMuMDkyIDUuODYtMTMuMDkyIDEzLjA5MyAwIDEuMDI2LjExOCAyLjAyLjMzOCAyLjk4QzI1LjU0MyAyNC41MjcgMTUuOSAxOS4zMTggOS40NCAxMS4zOTZjLTEuMTI1IDEuOTM2LTEuNzcgNC4xODQtMS43NyA2LjU4IDAgNC41NDMgMi4zMTIgOC41NTIgNS44MjQgMTAuOS0yLjE0Ni0uMDctNC4xNjUtLjY1OC01LjkzLTEuNjQtLjAwMi4wNTYtLjAwMi4xMS0uMDAyLjE2MyAwIDYuMzQ1IDQuNTEzIDExLjYzOCAxMC41MDQgMTIuODQtMS4xLjI5OC0yLjI1Ni40NTctMy40NS40NTctLjg0NSAwLTEuNjY2LS4wNzgtMi40NjQtLjIzIDEuNjY3IDUuMiA2LjUgOC45ODUgMTIuMjMgOS4wOS00LjQ4MiAzLjUxLTEwLjEzIDUuNjA1LTE2LjI2IDUuNjA1LTEuMDU1IDAtMi4wOTYtLjA2LTMuMTIyLS4xODQgNS43OTQgMy43MTcgMTIuNjc2IDUuODgyIDIwLjA2NyA1Ljg4MiAyNC4wODMgMCAzNy4yNS0xOS45NSAzNy4yNS0zNy4yNSAwLS41NjUtLjAxMy0xLjEzMy0uMDM4LTEuNjkzIDIuNTU4LTEuODQ3IDQuNzc4LTQuMTUgNi41MzItNi43NzR6Ii8+PC9zdmc+');
}
.Icon--verified {
  opacity: 1;
  cursor: default;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA3MiI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGg2NHY3MkgweiIvPjxwYXRoIGZpbGw9IiM4OGM5ZjkiIGQ9Ik0zIDM3LjMxNWMwIDQuMTI1IDIuMTYyIDcuNzI2IDUuMzYzIDkuNjI0LS4wNTYuNDY3LS4wOS45MzctLjA5IDEuNDIgMCA2LjEwMyA0LjcyIDExLjA0NSAxMC41NDYgMTEuMDQ1IDEuMjk1IDAgMi41NDItLjIzNCAzLjY4Ny0uNjg2QzI0LjIyIDYyLjQgMjcuODI3IDY0LjkzIDMyIDY0LjkzYzQuMTc0IDAgNy43ODItMi41MyA5LjQ5LTYuMjEzIDEuMTQ4LjQ1IDIuMzkuNjg1IDMuNjkuNjg1IDUuODI2IDAgMTAuNTQ2LTQuOTQgMTAuNTQ2LTExLjA0NSAwLS40ODMtLjAzNy0uOTUzLS4wOTMtMS40MkM1OC44MyA0NS4wNCA2MSA0MS40NCA2MSAzNy4zMTRjMC00LjM3LTIuNDItOC4xNS01LjkzMy05Ljk0Ni40MjctMS4yMDMuNjU4LTIuNS42NTgtMy44NjUgMC02LjEwNC00LjcyLTExLjA0NS0xMC41NDUtMTEuMDQ1LTEuMzAyIDAtMi41NDMuMjMyLTMuNjkuNjg4LTEuNzA3LTMuNjg1LTUuMzE1LTYuMjE2LTkuNDktNi4yMTYtNC4xNzMgMC03Ljc3OCAyLjUzLTkuNDkyIDYuMjE2LTEuMTQ2LS40NTUtMi4zOTMtLjY4OC0zLjY4OC0uNjg4LTUuODI3IDAtMTAuNTQ1IDQuOTQtMTAuNTQ1IDExLjA0NSAwIDEuMzY0LjIzIDIuNjYyLjY1NiAzLjg2NEM1LjQyIDI5LjE2MyAzIDMyLjk0NCAzIDM3LjMxNHoiLz48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTcuODcgMzkuMDhsNy4wMTUgNi45NzhjLjU4NS41ODIgMS4zNS44NzMgMi4xMTYuODczLjc3IDAgMS41NDItLjI5NCAyLjEyNy0uODgzLjM0NC0uMzQ2IDE1Ljk4LTE1Ljk3NCAxNS45OC0xNS45NzQgMS4xNzItMS4xNzIgMS4xNzItMy4wNyAwLTQuMjQzLTEuMTctMS4xNy0zLjA3LTEuMTcyLTQuMjQyIDBsLTEzLjg3IDEzLjg2My00Ljg5Mi00Ljg2OGMtMS4xNzQtMS4xNjgtMy4wNzQtMS4xNjQtNC4yNDIuMDEtMS4xNjggMS4xNzYtMS4xNjMgMy4wNzUuMDEgNC4yNDR6Ii8+PC9zdmc+');
}
.Icon--heart {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NCA3MiI+PHBhdGggY2xhc3M9Imljb24iIGZpbGw9IiM4ODk5YTYiIGQ9Ik0zOC43MjMgMTJjLTcuMTg3IDAtMTEuMTYgNy4zMDYtMTEuNzIzIDguMTMtLjU2My0uODI0LTQuNDk2LTguMTMtMTEuNzIzLTguMTNDOC43OSAxMiAzLjUzMyAxOC4xNjMgMy41MzMgMjQuNjQ3IDMuNTMzIDM5Ljk2NCAyMS44OSA1NS45MDcgMjcgNTZjNS4xMS0uMDkzIDIzLjQ2Ny0xNi4wMzYgMjMuNDY3LTMxLjM1M0M1MC40NjcgMTguMTYzIDQ1LjIxIDEyIDM4LjcyMyAxMnoiLz48L3N2Zz4=');
}
.Icon--heart:hover {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NCA3MiI+PHBhdGggY2xhc3M9Imljb24iIGZpbGw9IiNlODFjNGYiIGQ9Ik0zOC43MjMgMTJjLTcuMTg3IDAtMTEuMTYgNy4zMDYtMTEuNzIzIDguMTMtLjU2My0uODI0LTQuNDk2LTguMTMtMTEuNzIzLTguMTNDOC43OSAxMiAzLjUzMyAxOC4xNjMgMy41MzMgMjQuNjQ3IDMuNTMzIDM5Ljk2NCAyMS44OSA1NS45MDcgMjcgNTZjNS4xMS0uMDkzIDIzLjQ2Ny0xNi4wMzYgMjMuNDY3LTMxLjM1M0M1MC40NjcgMTguMTYzIDQ1LjIxIDEyIDM4LjcyMyAxMnoiLz48L3N2Zz4=');
}
.Icon--share {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Ni44IDcyIj48cGF0aCBmaWxsPSJub25lIiBkPSJNMC0uN2g0OHY3MkgweiIvPjxwYXRoIGNsYXNzPSJpY29uIiBmaWxsPSIjNjY3NTgwIiBkPSJNNTIuOCAzMi45TDQyLjIgMjIuM2MtMS40LTEuNC0zLjYtMS40LTUgMHMtMS40IDMuNiAwIDVsNC42IDQuNkgyMC45Yy0xLjkgMC0zLjUgMS42LTMuNSAzLjVzMS42IDMuNSAzLjUgMy41aDIwLjlsLTQuNiA0LjZjLTEuNCAxLjQtMS40IDMuNiAwIDUgLjcuNyAxLjYgMSAyLjUgMXMxLjgtLjMgMi41LTFsMTAuNi0xMC42YzEuNC0xLjQgMS40LTMuNiAwLTV6Ii8+PHBhdGggY2xhc3M9Imljb24iIGZpbGw9IiM2Njc1ODAiIGQ9Ik0yNC40IDQ5LjRoLTEzYy0uNiAwLTEuMS0uNS0xLjItMS4xVjIyLjRjMC0uNy41LTEuMiAxLjItMS4yaDEyLjljMS45IDAgMy41LTEuNiAzLjUtMy41cy0xLjYtMy41LTMuNS0zLjVIOC45Yy0zLjEgMC01LjcgMi41LTUuNyA1Ljd2MzFjMCAzLjEgMi41IDUuNyA1LjcgNS43aDE1LjVjMS45IDAgMy41LTEuNiAzLjUtMy41LjEtMi4xLTEuNS0zLjctMy41LTMuN3oiLz48L3N2Zz4=');
}
.Icon--share:hover {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1Ni44IDcyIj48cGF0aCBmaWxsPSJub25lIiBkPSJNMC0uN2g0OHY3MkgweiIvPjxwYXRoIGNsYXNzPSJpY29uIiBmaWxsPSIjMDA4NGI0IiBkPSJNNTIuOCAzMi45TDQyLjIgMjIuM2MtMS40LTEuNC0zLjYtMS40LTUgMHMtMS40IDMuNiAwIDVsNC42IDQuNkgyMC45Yy0xLjkgMC0zLjUgMS42LTMuNSAzLjVzMS42IDMuNSAzLjUgMy41aDIwLjlsLTQuNiA0LjZjLTEuNCAxLjQtMS40IDMuNiAwIDUgLjcuNyAxLjYgMSAyLjUgMXMxLjgtLjMgMi41LTFsMTAuNi0xMC42YzEuNC0xLjQgMS40LTMuNiAwLTV6Ii8+PHBhdGggY2xhc3M9Imljb24iIGZpbGw9IiMwMDg0YjQiIGQ9Ik0yNC40IDQ5LjRoLTEzYy0uNiAwLTEuMS0uNS0xLjItMS4xVjIyLjRjMC0uNy41LTEuMiAxLjItMS4yaDEyLjljMS45IDAgMy41LTEuNiAzLjUtMy41cy0xLjYtMy41LTMuNS0zLjVIOC45Yy0zLjEgMC01LjcgMi41LTUuNyA1Ljd2MzFjMCAzLjEgMi41IDUuNyA1LjcgNS43aDE1LjVjMS45IDAgMy41LTEuNiAzLjUtMy41LjEtMi4xLTEuNS0zLjctMy41LTMuN3oiLz48L3N2Zz4=');
}
</style>
<div class="tw-block-parent">
  <div class="timeline-TweetList-tweet">
    <div class="timeline-Tweet">
      <div class="timeline-Tweet-brand">
        <div class="Icon Icon--twitter"></div>
      </div>
      <div class="timeline-Tweet-author">
        <div class="TweetAuthor"><a class="TweetAuthor-link" href="#channel"> </a><span class="TweetAuthor-avatar"> 
            <div class="Avatar"> </div></span><span class="TweetAuthor-name">TwitterDev </span><span class="Icon Icon--verified"> </span><span class="TweetAuthor-screenName">@TwitterDev </span></div>
      </div>
      <div class="timeline-Tweet-text">We're excited for the inaugural Twitter Community Meetup<a href="#">@TwitterSeattle </a><span>tomorrow! </span><a href="#">#TapIntoTwitter </a><a href="#">meetup.com/Seattle-Twitte… </a></div>
      <div class="timeline-Tweet-metadata"><span class="timeline-Tweet-timestamp">9h</span></div>
      <ul class="timeline-Tweet-actions">
        <li class="timeline-Tweet-action"><a class="Icon Icon--heart" href="#"></a></li>
        <li class="timeline-Tweet-action"><a class="Icon Icon--share" href="#"></a></li>
      </ul>
    </div>
  </div>
</div>

<style>
.tw-block-parent
	.timeline-TweetList-tweet
		.timeline-Tweet
			.timeline-Tweet-brand
				.Icon.Icon--twitter

			.timeline-Tweet-author
				.TweetAuthor
					a.TweetAuthor-link(href="#channel") 
					span.TweetAuthor-avatar 
						.Avatar 
					span.TweetAuthor-name TwitterDev 
					span.Icon.Icon--verified 
					span.TweetAuthor-screenName @TwitterDev 

			.timeline-Tweet-text We're excited for the inaugural Twitter Community Meetup
				a(href="#") @TwitterSeattle 
				span tomorrow! 
				a(href="#") #TapIntoTwitter 
				a(href="#") meetup.com/Seattle-Twitte… 

			.timeline-Tweet-metadata
				span.timeline-Tweet-timestamp 9h

			ul.timeline-Tweet-actions
				li.timeline-Tweet-action
					a.Icon.Icon--heart(href="#")

				li.timeline-Tweet-action
					a.Icon.Icon--share(href="#")
                    </style>

`
  constructor(element, cms, callback) {
    super(element, cms, callback, tweet.html)
  }
}