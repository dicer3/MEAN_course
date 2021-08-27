import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent {
  newPost = 'parul'
  enteredContent = ''
  enteredTitle = ''


  constructor(public postsService: PostsService) { }

  onAddPost = (postForm: NgForm) => {
    if (postForm.invalid)
      return
    else
      this.postsService.addPost(postForm.value.title, postForm.value.content)
    postForm.resetForm();

  }
}
