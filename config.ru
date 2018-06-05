require 'roda'
require 'sqlite3'
require 'bcrypt'

@@db = SQLite3::Database.open "db.db"
@@db.results_as_hash = true

class App < Roda
  plugin :render
  plugin :static, ['/fonts', '/images', '/js', '/styles']
  # opts[:layout] = 'layout'

  def result_to_a res
    res.map{|x| x}
  end

  route do |r|
    r.root do
      view("index", template: 'layout')
    end

    r.get "games", String do |game_name|
      @name = game_name
      view("brackets", template: 'layout')
    end

    r.post "create" do
      @error = true
      @name = r.params['name']
      @admin_password = r.params['admin_password']

      q = @@db.prepare("select name from games where name = ?")
      exists = result_to_a(q.execute(r.params['name'])).size > 0

      if exists
        puts result_to_a(q.execute(r.params['name']))
        view("index", template: 'layout')
      else
        create_q = @@db.prepare("insert into games (name, admin_password) VALUES (?, ?)")
        create_q.execute(@name, @admin_password)
        r.redirect "/games/#{@name}"
      end
    end
  end
end

run App.freeze.app
