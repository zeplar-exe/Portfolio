### Purpose and Motivation

The intention with Shardly is to enhance the writing experience by encouraging momentum-based writing beyond word counts and stats. To achieve this, the main three features of Shardly, Shards, Bits, and Prose, interconnect to model the three levels of idea development.

### Design and Features

As mentioned, the backbone of Shardly consists of three primary features: Shards, Bits, and Prose. These are tied together via the AI writing assistant.

**Shards** are small tidbits of information describing characters, events, locations, and the world as a whole. Shards are grouped manually or automatically, depending on user preferences. The writing assistant uses shards to suggest new bits, validate consistency across bits and prose, and keep track of all atomic information about the world.

**Bits** are drafts of paragraphs, scenes, and chapters. Bits are organized within threads that define a central theme or timeline. The Bit editor is designed to encourage forward momentum by discouraging backtracking and backviewing. The writing assistant uses information from bits to build new threads, suggest changes to shards and prose, and further validate consistency within the prose. The thread interface additionally allows the user to implement their bits into prose for revision and organization.

**Prose** is exactly what it sounds like, but with a few extra features on top to integrate Shards and Bits. By default, Shardly resembles a standard word processor with access to folder-contained documents for user-defined organization. Documents themselves are made up of "Prose Blocks" which are units containing either plain text or the results of exporting a thread into prose. Blocks can be manipulated and moved freely within a document, allowing easy of editing when working with large units of narrative.

### Architecture

Shardly is built with 

### Development Challenges

### Limitations

### Potential Improvements and Additions