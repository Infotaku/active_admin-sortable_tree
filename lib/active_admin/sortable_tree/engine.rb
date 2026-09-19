# frozen_string_literal: true

module ActiveAdmin
  module SortableTree
    class Engine < ::Rails::Engine
      engine_name "active_admin-sortable_tree"

      config.aa_sortable_tree = ActiveSupport::OrderedOptions.new
      config.aa_sortable_tree.register_assets = true

      initializer "active_admin-sortable_tree.precompile", group: :all do |app|
        if app.config.respond_to?(:assets)
          app.config.assets.precompile += [
            "active_admin/sortable.css",
            "active_admin/sortable.js"
          ]
        end
      end

      initializer "active_admin-sortable_tree.importmap", after: "importmap" do |app|
        next unless app.config.respond_to?(:importmap)

        ActiveAdmin.importmap.draw(Engine.root.join("config", "importmap.rb"))
        js_path = Engine.root.join("app/javascript")
        if app.config.respond_to?(:assets)
          app.config.assets.paths << js_path
        end
      end

      initializer "active_admin-sortable_tree.register_assets" do
        next unless config.aa_sortable_tree.register_assets

        if ActiveAdmin.application.respond_to?(:register_stylesheet)
          ActiveAdmin.application.register_stylesheet "active_admin/sortable.css"
        end

        if ActiveAdmin.application.respond_to?(:register_javascript)
          ActiveAdmin.application.register_javascript "active_admin/sortable.js"
        end
      end
    end
  end
end
