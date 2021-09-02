import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  newPost = 'parul'
  enteredContent = ''
  enteredTitle = ''
  mode = ''
  postId = ''
  isLoading = false;
  post: Post;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((parampMap: ParamMap) => {
      if (parampMap.has('postId')) {
        this.mode = 'edit';
        this.postId = parampMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          console.log("calling http...");
          this.post = { id: postData._id, title: postData.title, content: postData.content }
        });
        console.log("ang...", this.postId, "...", this.post)
      } else {
        this.mode = 'create'
        // this.post = null;
      }
    });
  }
  onSavePost = (postForm: NgForm) => {
    if (postForm.invalid)
      return
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(postForm.value.title, postForm.value.content)
    } else {
      this.postsService.updatePost(this.postId, postForm.value.title, postForm.value.content)
    }

    postForm.resetForm();
  }
}
