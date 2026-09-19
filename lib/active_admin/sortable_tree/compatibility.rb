# frozen_string_literal: true

module ActiveAdmin
  module SortableTree
    class Compatibility
      def self.normalized_resource_name(resource_name)
        resource_name = resource_name.to_s

        if Rails::VERSION::MAJOR >= 5
          resource_name.underscore.parameterize(separator: "_")
        else
          resource_name.underscore.parameterize("_")
        end
      end
    end
  end
end
