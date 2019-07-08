# frozen_string_literal: true

class RemoveGitalyFeatureFlags < ActiveRecord::Migration[5.1]
  include Gitlab::Database::MigrationHelpers

  DOWNTIME = false

  FEATURES = %w[
    gitaly_batch_lfs_pointers gitaly_blame gitaly_blob_get_all_lfs_pointers gitaly_blob_get_new_lfs_pointers
    gitaly_branch_names gitaly_branch_names_contains_sha gitaly_branches gitaly_bundle_to_disk
    gitaly_calculate_checksum gitaly_can_be_merged gitaly_cherry_pick gitaly_commit_count
    gitaly_commit_deltas gitaly_commit_languages gitaly_commit_messages gitaly_commit_patch
    gitaly_commit_raw_diffs gitaly_commit_stats gitaly_commit_tree_entry gitaly_commits_between
    gitaly_commits_by_message gitaly_conflicts_list_conflict_files gitaly_conflicts_resolve_conflicts gitaly_count_commits
    gitaly_count_diverging_commits_no_max gitaly_create_branch gitaly_create_repo_from_bundle gitaly_create_repository
    gitaly_delete_branch gitaly_delete_refs gitaly_delta_islands gitaly_deny_disk_acces
    gitaly_diff_between gitaly_extract_commit_signature gitaly_fetch_ref gitaly_fetch_remote
    gitaly_fetch_source_branch gitaly_filter_shas_with_signature gitaly_filter_shas_with_signatures gitaly_find_all_commits
    gitaly_find_branch gitaly_find_commit gitaly_find_commits gitaly_find_ref_name
    gitaly_force_push gitaly_fork_repository gitaly_garbage_collect gitaly_get_info_attributes
    gitaly_git_blob_load_all_data gitaly_git_blob_raw gitaly_git_fsck gitaly_go-find-all-tags
    gitaly_has_local_branches gitaly_import_repository gitaly_is_ancestor gitaly_last_commit_for_path
    gitaly_license_short_name gitaly_list_blobs_by_sha_path gitaly_list_commits_by_oid gitaly_local_branches
    gitaly_ls_files gitaly_merge_base gitaly_merged_branch_names gitaly_new_commits
    gitaly_operation_user_add_tag gitaly_operation_user_commit_file gitaly_operation_user_commit_files gitaly_operation_user_create_branch
    gitaly_operation_user_delete_branch gitaly_operation_user_delete_tag gitaly_operation_user_ff_branch gitaly_operation_user_merge_branch
    gitaly_post_receive_pack gitaly_post_upload_pack gitaly_project_raw_show gitaly_raw_changes_between
    gitaly_rebase gitaly_rebase_in_progress gitaly_ref_delete_refs gitaly_ref_exists
    gitaly_ref_exists_branch gitaly_ref_exists_branches gitaly_ref_find_all_remote_branches gitaly_remote_add_remote
    gitaly_remote_fetch_internal_remote gitaly_remote_remove_remote gitaly_remote_update_remote_mirror gitaly_remove_namespace
    gitaly_repack_full gitaly_repack_incremental gitaly_repository_cleanup gitaly_repository_exists
    gitaly_repository_size gitaly_root_ref gitaly_search_files_by_content gitaly_search_files_by_name
    gitaly_squash gitaly_squash_in_progress gitaly_ssh_receive_pack gitaly_ssh_upload_pack
    gitaly_submodule_url_for gitaly_tag_messages gitaly_tag_names gitaly_tag_names_contains_sha
    gitaly_tags gitaly_tree_entries gitaly_wiki_delete_page gitaly_wiki_find_file
    gitaly_wiki_find_page gitaly_wiki_get_all_pages gitaly_wiki_page_formatted_data gitaly_wiki_page_versions
    gitaly_wiki_update_page gitaly_wiki_write_page gitaly_workhorse_archive gitaly_workhorse_raw_show
    gitaly_workhorse_send_git_diff gitaly_workhorse_send_git_patch gitaly_write_config gitaly_write_ref
  ]

  class Feature < ActiveRecord::Base
    self.table_name = 'features'
  end

  def up
    Feature.where(key: FEATURES).delete_all
  end
end