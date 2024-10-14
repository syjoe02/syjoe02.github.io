module Jekyll
    class TagPageGenerator < Generator
      safe true
  
      def generate(site)
        site.tags.each do |tag, posts|
          slug = tag.gsub(' ', '-').gsub(/[^\w-]/, '') # Keep the original case in the slug
          site.pages << TagPage.new(site, site.source, File.join('tags', tag), tag)
        end
      end
    end
  
    class TagPage < Page
      def initialize(site, base, dir, tag)
        @site = site
        @base = base
        @dir = dir
        @name = 'index.html'
  
        self.process(@name)
        self.read_yaml(File.join(base, '_layouts'), 'tag.html')
        self.data['tag'] = tag
        self.data['title'] = "Posts tagged as \"#{tag}\""
      end
    end
  end
  