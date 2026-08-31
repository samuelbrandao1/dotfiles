return {
  "lervag/vimtex",
  lazy = false,     -- we don't want to lazy load VimTeX
  -- tag = "v2.15", -- uncomment to pin to a specific release
  init = function()
    -- VimTeX configuration goes here, e.g.
    vim.g.vimtex_compiler_latexmk = {
      options = {
        '-lualatex',
      },
    }
    vim.g.vimtex_view_method = "zathura"
    vim.g.vimtex_compiler_method = "latexmk"
    vim.keymap.set("n", "<leader>ll", "<cmd>VimtexCompile<CR>", { desc = "VimTeX Compile" })
    vim.keymap.set("n", "<leader>lv", "<cmd>VimtexView<CR>", { desc = "VimTeX View" })
  end
}
