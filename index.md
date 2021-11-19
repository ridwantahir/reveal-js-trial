<p style="text-align: right;" ><img style="vertical-align:middle" src="https://oromiafoundation.org/wp-content/uploads/2019/08/OF.png" alt="drawing" width="50" height="50"/>Oromia Foundation</p>

<div class="demo-top-heading">
<h1>How To Make Awesome Slides Using RevealJS And Custom Plugin</h1>
</div>

## Table of Contents


## The Concept of Coding a presenation
Coding has crossed its traditional boundaries of just developing applications. In the last few years, Deveops engineers have been using code to define infrastructure and brought to life the concept of Infrastructure as code. Tools like terraform enable writing infrastructure as a script that could be deployed with a click of a button. Confuguration as a code is also another concept that encourages managing configuration in a repository along side application code.
Meet presentation as a code. It is an alternative technique of writing a presentation or slide using code.  Unlike the traditional WYSIWYG tools, like power point and keynote, that rely on drag and drop, coding a presentation involves writing scripts that will later be rendered into a presenation.

We would like to extend the concept of coding a presentation into coding a course. Coding a course aims to write an entire course as source code files (Javascript, html, md, images, etc) that could be managed in a repository.
 
## Advantages of Course As Code
Presentation as a code (and course as a code), is not necessarily a better or worse choice to the traditional WYSIWYG tools like power point. Both have their places where they would be more suitable than the alternative. Coding a course offers the following advantages:
- version control system friendly
  - This feature opens a whole new opportunity. Using version control system makes collaboration easy. Multiple people could collaborate on the same course, working on diffrent topics at a time. Reviewing changes, giving a feedback and approving (or rejecting) changes is a what version control systems are for.
- Easier to illustrate code samples
- Flexible and extensbible
- Powerful custom animations can be integrated into the presentation using the power of programming languages
- Requires only basic knowledge of markdown and markup languages.
- Programmers friendly

## Drawbacks of Course As Code
Coding a presentation has a few drawbacks
- Requires basic knowledge of markdown(md) and markup languages(html).
- It is not easy to place components on the slide, exactly where needed, like in Powerpoint. However, these feature can be built with programming language easily. Morever, SVG could be used to immitate the drag and drop
  
## Summing up what we have discussed so far
Presentation/Course as a code is an alternative approach to WYSIWYG presentation tools. In coding a presentation, a presentation is written in either markdown or markup languages ( like html) and managed in version control systems like git. That means, no complicated xml, no binary files or blobs (except images). It is all either markdown or html.
This is the approach we highly highly recommend for courses prepared for [Oromia Foundation](https://oromiafoundation.org/)

## Introduction to RevealJS
[RevealJs](https://revealjs.com/) is an open source HTML presentation framework. It's a tool that enables anyone with a web browser to create fully-featured and beautiful presentations for free.
Presentations made with reveal.js are built on open web technologies. That means anything you can do on the web, you can do in your presentation. Change styles with CSS, include an external web page using an `<iframe>` or add your own custom behavior using our JavaScript API.

The framework comes with a broad range of features including nested slides, Markdown support, Auto-Animate, PDF export, speaker notes, LaTeX support and syntax highlighted code.

RevealJs is a customizable and configurable tool, with several options to author a presentation. However, for the sake of standarization and uniformity, we created a guideline on how to author and manage courses for [Oromia Foundation](https://oromiafoundation.org/). Please follow the guidlines and make use of sample codes provided to create custom slides. The sample codes can be easily copied and pasted into your slides. Trust us, creating presentation using RevealJs is very easy and even easier than PowerPoint in many cases

## Prerequisite
You will need a basic knowledge of markdown and html to be able to use [RevealJs](https://revealjs.com/). Don't worry it does not take more than five minutes to learn the basic concepts needed to create presentation [RevealJs](https://revealjs.com/)
- [Markdown Basic Tutorial](#) Coming Soon
- [Markdown Basic Tutorial](#) Coming Soon

## Guideline on making stunnig presentations
RevealJs supports has many great features that enable making dynamic slides. Extra features could be added with custom plugins. We have written custom plugins that you could use to make the slides even more awesome. Please use this guideline while authoring all courses.

While RevealJs slides could be written in either html or markdown, we use markdown files. However, some of the features are not available in markdown. In that case embed the html code inside the markdown. Additionally, the markdowns should be external files, not embedded in index.html file at the root of the course. This is necessary because a course contains multiple chapters and slides. Putting all these resources in the same file is difficult to manage.

### Basics
- Write your slides in markdown, except when the features are not aviable in markdown.
- The slides are separated by `---`. Although this is configurable in RevealJs, we standardize on `---`.
- example:
```md
## 1N Normalization
2N normalized tables has to satsify the following
- All 2N reqiuremnts
- That requirement
- This one also
- And the other One
---

## 2N Normalization
2N normalized tables has to satsify the following
- All 2N reqiuremnts
- That requirement
- This one also
- And the other One
---

## 3N Normalization
3N normalized tables has to satsify the following
- All 2N reqiuremnts
- That requirement
- This one also
- And the other One

I hope you learned something
```
Resulting slide:

<div>
        <iframe src="basic" name="thumbnails" frameborder="0" ></iframe>
</div>



### Tables
- Tables could also be easily added to your presentaion. 
- More formatting options will be added soon
- example
```md
### Table1
This is Data from 1897

| Date  | City | Country |
| :------|:----|:----|
|2020-09-11|Frankfurt|Germany|
|2020-09-12|Munich|Germany|
|2020-09-11|Los Angeles|USA|
|2020-09-16|Seattle|USA|
---
### Table2
This is States abreviation

| Abreviation  | State | Country |
| :------|:----|:----|
|FL|Florida|USA|
|CA|California|USA|
|Ny|New York|USA|
|WA|Washington|USA|
```

Resulting slide:

<div>
        <iframe src="basictable" name="thumbnails" frameborder="0" ></iframe>
</div>

### Code Samples
- Code samples can be added to the slide using markdown code syntax
- Almost all languages are supported in RevealJs
- Example

<pre><code>
## Python Food Class
```python
class Food():
    def __init():
        print("my food")
        return
    def eat():
        print("I am eating")
```
`Food.eat()` is called at luch time
---
## Java Food class
```java
class Food{
    public Food{
        System.out.println("my food")
        return
    }
    private void eat(){
        System.out.println(("I am eating")
    }
}
```
`Food.eat()` is called at luch time
</code></pre>

Resulting slide:

<div>
        <iframe src="basiccodesample" name="thumbnails" frameborder="0" ></iframe>
</div>

### A lot more is coming soon ... 