git filter-repo --force --commit-callback '
    commit.author_name = b"Mike"
    commit.author_email = b"mikem.tba@gmail.com"
    commit.committer_name = b"Mike"
    commit.committer_email = b"mikem.tba@gmail.com"
'