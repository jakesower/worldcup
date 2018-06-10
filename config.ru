require 'roda'
require 'sqlite3'
require 'bcrypt'

@@db = SQLite3::Database.open "db/db.db"
@@db.results_as_hash = true

class App < Roda
  plugin :render
  plugin :static, ['/fonts', '/images', '/js', '/styles']

  def result_to_a res
    res.map{|x| x}
  end

  route do |r|
    r.root do
      view("index", template: 'layout')
    end

    r.on "games", String do |game_name|
      @name = game_name

      r.is do
        r.get do
          view("brackets", template: 'layout')
        end
      end

      r.get "view" do
        players_q = @@db.prepare("select player from brackets where game = ?")

        @players = players_q.execute(game_name)
        view("game", template: 'layout')
      end

      r.post "submit" do
        q = @@db.prepare("insert into brackets(game, player, bracket) values (?, ?, ?)")
        q.execute(game_name, r.params['name'], r.params['bracket'])
        r.redirect "/games/#{game_name}/view"
      end
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
