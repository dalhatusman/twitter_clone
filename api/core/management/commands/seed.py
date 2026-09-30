import random

from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from faker import Faker

from core.models import Profile, Post, Comment


fake = Faker()


class Command(BaseCommand):
    help = "Creates mock users, profiles, posts, comments and likes"

    def handle(self, *args, **kwargs):

        self.stdout.write("Creating mock data...")

        # ==========================================
        # 1. CREATE USERS AND PROFILES
        # ==========================================

        users = []

        for _ in range(20):

            user = User.objects.create_user(
                username=fake.unique.user_name(),
                email=fake.unique.email(),
                password="SeedPassword!"
            )

            Profile.objects.create(
                user=user,
                full_name=fake.name(),
                bio=fake.text(max_nb_chars=150)
            )

            users.append(user)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(users)} users and profiles"
            )
        )

        # ==========================================
        # 2. CREATE POSTS
        # ==========================================

        posts = []

        for _ in range(100):

            post = Post.objects.create(
                user=random.choice(users),
                text=fake.text(max_nb_chars=280)
            )

            posts.append(post)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(posts)} posts"
            )
        )

        # ==========================================
        # 3. CREATE COMMENTS
        # ==========================================

        comments = []

        for _ in range(300):

            comment = Comment.objects.create(
                user=random.choice(users),
                post=random.choice(posts),
                text=fake.sentence()
            )

            comments.append(comment)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(comments)} comments"
            )
        )

        # ==========================================
        # 4. ADD LIKES TO POSTS
        # ==========================================

        for post in posts:

            # Random number of likes between 0 and
            # the total number of users
            number_of_likes = random.randint(
                0,
                len(users)
            )

            # Select unique users
            users_to_like = random.sample(
                users,
                number_of_likes
            )

            # Add all selected users as likes
            post.likes.add(*users_to_like)

        self.stdout.write(
            self.style.SUCCESS(
                "Added likes to posts"
            )
        )

        # ==========================================
        # 5. ADD LIKES TO COMMENTS
        # ==========================================

        for comment in comments:

            number_of_likes = random.randint(
                0,
                len(users)
            )

            users_to_like = random.sample(
                users,
                number_of_likes
            )

            comment.likes.add(*users_to_like)

        self.stdout.write(
            self.style.SUCCESS(
                "Added likes to comments"
            )
        )

        # ==========================================
        # DONE
        # ==========================================

        self.stdout.write(
            self.style.SUCCESS(
                "Mock data created successfully!"
            )
        )