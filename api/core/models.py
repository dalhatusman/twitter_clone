from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    full_name = models.CharField(max_length=130, blank=True)
    profile_picture = models.ImageField(upload_to='profile-pics/', blank=True)
    bio = models.TextField(blank=True)
    year_created= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    text = models.TextField(max_length=280)
    image = models.ImageField(upload_to="post-image/", blank=True )
    likes = models.ManyToManyField(User, blank=True, related_name="liked_post")
    bookmarks = models.ManyToManyField(User, related_name='bookmarked_posts', blank=True)
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.text[:30]}"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments" )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    likes = models.ManyToManyField(User, blank=True, related_name="liked_comments")
    bookmarks = models.ManyToManyField(User, related_name='bookmarked_comments', blank=True)
    created_at= models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on Post {self.post.id}"

