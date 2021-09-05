import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../post.service";
import { mimeType } from "./mime-type.validator";
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
  imagePreview: string;
  form: FormGroup;
  post: Post;
  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit() {

    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })

    this.route.paramMap.subscribe((parampMap: ParamMap) => {
      if (parampMap.has('postId')) {
        this.mode = 'edit';
        this.postId = parampMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          console.log("calling http...", postData._id);
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: null
          }
          this.form.setValue({
            title: postData.title,
            content: postData.content,
            image: postData.imagePath
          })
          console.log("value..", this.form.value)
        });
      } else {
        this.mode = 'create'
        // this.post = null;
      }
    });
  }

  async onImagePicker(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      console.log("reader...",)
      this.imagePreview = reader.result as string;
    }

    reader.onerror = (error) => {
      console.log("Input: File could not be read:" + error);
    };

    reader.onloadend = () => {
      console.log("load end...")
    };
  }

  onSavePost = () => {
    if (this.form.invalid)
      return
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image)
    } else {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
    }

    this.form.reset();
  }
}
